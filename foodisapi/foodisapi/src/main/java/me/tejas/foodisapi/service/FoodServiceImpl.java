package me.tejas.foodisapi.service;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import me.tejas.foodisapi.Respository.FoodRepository;
import me.tejas.foodisapi.entity.FoodEntity;
import me.tejas.foodisapi.io.FoodRequest;
import me.tejas.foodisapi.io.FoodResponse;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@Service
public class FoodServiceImpl implements FoodsService{
    
    @Autowired
    private FoodRepository foodRepository;
    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucketname}")
    private String bucketName;
    @Value("${aws.region}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file) {
        @SuppressWarnings("null")
        String filenameExtnesion = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+filenameExtnesion;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName).key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();
            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if(response.sdkHttpResponse().isSuccessful()) {
                return "https://"+bucketName+".s3."+region+".amazonaws.com/"+key;
            }
            else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"file upload failed");
            }
        }
        catch(IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while uploading file");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToFoodResponse(newFoodEntity);
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
        .name(request.getName())
        .description(request.getDescription())
        .category(request.getCategory())
        .price(request.getPrice())
        .build();
    }

    private FoodResponse convertToFoodResponse(FoodEntity entity) {
        return FoodResponse.builder()
        .id(entity.getId())
        .name(entity.getName())
        .description(entity.getDescription())
        .category(entity.getCategory())
        .price(entity.getPrice())
        .imageUrl(entity.getImageUrl())
        .build();
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> dataFoodEntities = foodRepository.findAll();
        return dataFoodEntities.stream().map(object -> convertToFoodResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("food not found for the id: "+id));
        return convertToFoodResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                                                  .bucket(bucketName)
                                                  .key(fileName)
                                                  .build();
        s3Client.deleteObject(deleteObjectRequest);  
        return true;                 
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        String imageUrl = response.getImageUrl();
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/")+1);
        boolean isDeleted = deleteFile(fileName);
        if (isDeleted) {
            foodRepository.deleteById(response.getId());
        }
    }
}
