package me.tejas.foodisapi.service;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;
import me.tejas.foodisapi.Respository.UserRepository;
import me.tejas.foodisapi.entity.UserEntity;

@Service
@AllArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
     
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            
        return new User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }
}