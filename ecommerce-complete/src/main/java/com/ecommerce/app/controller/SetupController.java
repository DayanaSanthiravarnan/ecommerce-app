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

    @GetMapping("/reset")
    public Map<String, String> reset() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
        return Map.of("message", "All data cleared. Now call /api/setup/init");
    }

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
        String[] catNames = {"Men", "Women", "Girls", "Boys", "Kids"};
        Category[] cats = new Category[5];
        for (int i = 0; i < catNames.length; i++) {
            Category c = new Category();
            c.setName(catNames[i]);
            cats[i] = categoryRepository.save(c);
        }

        // 20 Dress Shop Products
        Object[][] products = {
            {"Men Formal Shirt", "Slim fit cotton formal shirt for office wear", 34.99, 100, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400", 0},
            {"Men Casual T-Shirt", "Comfortable round neck cotton t-shirt", 19.99, 150, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", 0},
            {"Men Denim Jeans", "Classic straight fit blue denim jeans", 49.99, 80, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 0},
            {"Men Ethnic Kurta", "Traditional cotton kurta for festive occasions", 39.99, 60, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", 0},
            {"Women Saree", "Elegant silk saree with golden border", 89.99, 40, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", 1},
            {"Women Kurti", "Printed cotton kurti perfect for daily wear", 29.99, 120, "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5e?w=400", 1},
            {"Women Floral Dress", "Elegant floral print summer dress", 54.99, 90, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", 1},
            {"Women Leggings", "Stretchable high-waist leggings for comfort", 24.99, 200, "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400", 1},
            {"Women Salwar Suit", "Beautiful embroidered salwar kameez set", 69.99, 50, "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400", 1},
            {"Girls Frock", "Cute floral frock for little girls", 22.99, 100, "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400", 2},
            {"Girls Party Dress", "Sparkly tutu dress for birthday parties", 34.99, 70, "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400", 2},
            {"Girls Lehenga", "Traditional lehenga choli for festivals", 44.99, 45, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", 2},
            {"Girls Casual Top", "Colorful printed top for everyday wear", 14.99, 130, "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", 2},
            {"Boys Shirt & Pants Set", "Smart formal set for school and events", 29.99, 80, "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400", 3},
            {"Boys Graphic T-Shirt", "Fun printed t-shirt for active boys", 17.99, 150, "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", 3},
            {"Boys Denim Shorts", "Comfortable denim shorts for summer", 22.99, 100, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 3},
            {"Boys Ethnic Kurta", "Festive cotton kurta pajama set for boys", 27.99, 60, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", 3},
            {"Kids Winter Jacket", "Warm padded jacket for cold weather", 44.99, 55, "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400", 4},
            {"Kids Pyjama Set", "Soft cotton night suit for kids", 19.99, 180, "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400", 4},
            {"Kids School Uniform", "Durable and comfortable school uniform set", 32.99, 90, "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", 4},
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

        return Map.of("message", "Dress shop setup complete! Admin: admin / Admin@123 — 20 products added");
    }
}
