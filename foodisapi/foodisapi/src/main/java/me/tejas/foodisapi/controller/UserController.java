package me.tejas.foodisapi.controller;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import lombok.AllArgsConstructor;
import me.tejas.foodisapi.io.RegisterRequest;
import me.tejas.foodisapi.io.RegisterResponse;
import me.tejas.foodisapi.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    final private UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return userService.RegisterUser(request);
    }   
}
