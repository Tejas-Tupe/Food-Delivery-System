package me.tejas.foodisapi.service;

import me.tejas.foodisapi.io.RegisterRequest;
import me.tejas.foodisapi.io.RegisterResponse;

public interface UserService {
    RegisterResponse RegisterUser(RegisterRequest request);

    String findByUserId();
}