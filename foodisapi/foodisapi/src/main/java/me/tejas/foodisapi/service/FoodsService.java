package me.tejas.foodisapi.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import me.tejas.foodisapi.io.FoodRequest;
import me.tejas.foodisapi.io.FoodResponse;

public interface FoodsService {
    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFoods();

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);
}
