package me.tejas.foodisapi.Respository;

import org.springframework.data.mongodb.repository.MongoRepository;

import me.tejas.foodisapi.entity.FoodEntity;

public interface FoodRepository extends MongoRepository<FoodEntity, String>{
    
}
