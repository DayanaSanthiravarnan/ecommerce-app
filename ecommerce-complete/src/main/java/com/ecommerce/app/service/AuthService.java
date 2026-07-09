package com.ecommerce.app.service;

import com.ecommerce.app.dto.RegisterRequest;
import com.ecommerce.app.model.User;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            return "Username already exists";
        if (userRepository.existsByEmail(req.getEmail()))
            return "Email already exists";

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        return "Registered successfully";
    }
}
