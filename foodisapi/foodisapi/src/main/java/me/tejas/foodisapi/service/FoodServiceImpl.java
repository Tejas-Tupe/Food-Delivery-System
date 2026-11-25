package me.tejas.foodisapi.service;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.cloudinary.Cloudinary;
import me.tejas.foodisapi.Respository.FoodRepository;
import me.tejas.foodisapi.entity.FoodEntity;
import me.tejas.foodisapi.io.FoodRequest;
import me.tejas.foodisapi.io.FoodResponse;

@Service
public class FoodServiceImpl implements FoodsService{
    
    @Autowired
    private FoodRepository foodRepository;
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) {
        String publicId = "foods/" + UUID.randomUUID();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "public_id", publicId,
                    "resource_type", "image",
                    "overwrite", false));
            Object secureUrl = result.get("secure_url");
            if (secureUrl == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "file upload failed");
            }
            return secureUrl.toString();
        }
        catch (IOException ex) {
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
    public boolean deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, Map.of("resource_type", "image"));
            return true;
        }
        catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while deleting file");
        }
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        String imageUrl = response.getImageUrl();
        if (imageUrl != null && imageUrl.contains("res.cloudinary.com")) {
            deleteFile(extractPublicId(imageUrl));
        }
        foodRepository.deleteById(response.getId());
    }

    private String extractPublicId(String imageUrl) {
        String marker = "/upload/";
        int uploadIndex = imageUrl.indexOf(marker);
        if (uploadIndex < 0) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid image url");
        }
        String path = imageUrl.substring(uploadIndex + marker.length());
        int queryIndex = path.indexOf('?');
        if (queryIndex >= 0) {
            path = path.substring(0, queryIndex);
        }
        if (path.matches("v\\d+/.*")) {
            path = path.substring(path.indexOf('/') + 1);
        }
        int extensionIndex = path.lastIndexOf('.');
        if (extensionIndex > 0) {
            path = path.substring(0, extensionIndex);
        }
        return path;
    }
}
