package me.tejas.foodisapi.Respository;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import me.tejas.foodisapi.entity.UserEntity;

public interface UserRepository extends MongoRepository<UserEntity, String>{
    Optional<UserEntity> findByEmail(String email);
}
