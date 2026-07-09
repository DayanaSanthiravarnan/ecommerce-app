package com.ecommerce.app.controller;

import com.ecommerce.app.model.Category;
import com.ecommerce.app.model.Product;
import com.ecommerce.app.model.User;
import com.ecommerce.app.repository.CategoryRepository;
import com.ecommerce.app.repository.ProductRepository;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@RequiredArgsConstructor
public class SetupController {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/init")
    public Map<String, String> init() {
        if (userRepository.existsByUsername("admin")) {
            return Map.of("message", "Already initialized");
        }

        // Admin user
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@shopzone.com");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // Categories
        String[] catNames = {"Electronics", "Clothing", "Books", "Home & Kitchen", "Sports"};
        Category[] cats = new Category[5];
        for (int i = 0; i < catNames.length; i++) {
            Category c = new Category();
            c.setName(catNames[i]);
            cats[i] = categoryRepository.save(c);
        }

        // 20 Products
        Object[][] products = {
            {"iPhone 15 Pro", "Latest Apple smartphone with titanium design", 999.99, 50, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", 0},
            {"Samsung 4K TV 55\"", "Crystal clear 4K display with smart features", 649.99, 30, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", 0},
            {"Sony WH-1000XM5", "Industry-leading noise cancelling headphones", 349.99, 75, "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", 0},
            {"MacBook Air M2", "Supercharged by M2 chip, ultra-thin design", 1099.99, 25, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", 0},
            {"Wireless Keyboard", "Slim wireless keyboard with long battery life", 44.99, 110, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", 0},
            {"Men Classic T-Shirt", "Premium cotton everyday essential tee", 29.99, 200, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", 1},
            {"Women Floral Dress", "Elegant floral print summer dress", 59.99, 150, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", 1},
            {"Denim Jacket", "Classic blue denim jacket for all seasons", 79.99, 100, "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400", 1},
            {"Running Sneakers", "Lightweight performance running shoes", 89.99, 120, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 1},
            {"Wool Sweater", "Cozy merino wool sweater for winter", 69.99, 80, "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400", 1},
            {"Atomic Habits", "Build good habits and break bad ones", 16.99, 300, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", 2},
            {"The Alchemist", "A journey of self-discovery and dreams", 12.99, 250, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", 2},
            {"Deep Work", "Rules for focused success in a distracted world", 14.99, 180, "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400", 2},
            {"Air Fryer 5.8Qt", "Crispy food with 85% less oil", 89.99, 60, "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400", 3},
            {"Coffee Maker", "Brew perfect coffee every morning", 49.99, 90, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", 3},
            {"Blender Pro", "High-speed blender for smoothies and more", 69.99, 55, "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400", 3},
            {"Yoga Mat", "Non-slip premium yoga and exercise mat", 34.99, 140, "https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400", 4},
            {"Dumbbells Set 20kg", "Adjustable dumbbell set for home gym", 119.99, 45, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", 4},
            {"Cycling Helmet", "Lightweight safety helmet for cyclists", 54.99, 70, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 4},
            {"Water Bottle 1L", "Insulated stainless steel water bottle", 24.99, 200, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", 4},
        };

        for (Object[] p : products) {
            Product product = new Product();
            product.setName((String) p[0]);
            product.setDescription((String) p[1]);
            product.setPrice((Double) p[2]);
            product.setStock((Integer) p[3]);
            product.setImageUrl((String) p[4]);
            product.setCategory(cats[(Integer) p[5]]);
            productRepository.save(product);
        }

        return Map.of("message", "Setup complete! Admin: admin / Admin@123 — 20 products added");
    }
}
