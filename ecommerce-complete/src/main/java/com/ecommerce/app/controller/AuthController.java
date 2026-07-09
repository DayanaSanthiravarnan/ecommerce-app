package com.ecommerce.app.controller;

import com.ecommerce.app.dto.LoginRequest;
import com.ecommerce.app.dto.RegisterRequest;
import com.ecommerce.app.model.User;
import com.ecommerce.app.repository.UserRepository;
import com.ecommerce.app.security.JwtUtil;
import com.ecommerce.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByUsername(req.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", user.getUsername(),
            "role", user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String result = authService.register(req);
        if (result.equals("Registered successfully")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        return ResponseEntity.badRequest().body(Map.of("message", result));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", HtmlUtils.htmlEscape(user.getName()),
            "email", HtmlUtils.htmlEscape(user.getEmail()),
            "username", HtmlUtils.htmlEscape(user.getUsername()),
            "role", HtmlUtils.htmlEscape(user.getRole())
        ));
    }
}
