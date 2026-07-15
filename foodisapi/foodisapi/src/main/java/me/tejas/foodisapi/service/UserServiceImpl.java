package me.tejas.foodisapi.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import me.tejas.foodisapi.Respository.UserRepository;
import me.tejas.foodisapi.entity.UserEntity;
import me.tejas.foodisapi.exceptions.UserAlreadyExistsException;
import me.tejas.foodisapi.io.RegisterRequest;
import me.tejas.foodisapi.io.RegisterResponse;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public RegisterResponse RegisterUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("An account with this email already exists.");
        }
        
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToRegisterResponse(newUser);
    }

    private UserEntity convertToEntity(RegisterRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private RegisterResponse convertToRegisterResponse(UserEntity newUser) {
        return RegisterResponse.builder()
                .id(newUser.getId())
                .name(newUser.getName())
                .email(newUser.getEmail())
                .build();
    }

    @Override
    public String findByUserId() {
        String loggedInUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User does not exist"));
        return loggedInUser.getEmail();
    }
}