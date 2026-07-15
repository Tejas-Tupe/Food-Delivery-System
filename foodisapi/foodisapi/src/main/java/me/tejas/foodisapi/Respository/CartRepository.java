package me.tejas.foodisapi.Respository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import me.tejas.foodisapi.entity.CartEntity;

@Repository
public interface CartRepository extends MongoRepository<CartEntity, String>{
    
    Optional<CartEntity> findByUserId(String userid);

    void deleteByUserId(String userid);
}
