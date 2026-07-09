package com.ecommerce.app.config;

import com.ecommerce.app.model.Category;
import com.ecommerce.app.model.Product;
import com.ecommerce.app.repository.CategoryRepository;
import com.ecommerce.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(ApplicationArguments args) {
        updateAllPrices();
    }

    private void updateAllPrices() {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) return;

        for (Product p : products) {
            double newPrice = getRealisticPrice(p.getName().toLowerCase());
            p.setPrice(newPrice);
        }
        productRepository.saveAll(products);
    }

    private double getRealisticPrice(String name) {
        if (name.contains("saree"))           return 2499.00;
        if (name.contains("silk"))            return 3499.00;
        if (name.contains("lehenga"))         return 4999.00;
        if (name.contains("blazer"))          return 3299.00;
        if (name.contains("suit"))            return 5999.00;
        if (name.contains("formal shirt") || name.contains("office")) return 1299.00;
        if (name.contains("shirt"))           return 1099.00;
        if (name.contains("jeans") || name.contains("denim")) return 1799.00;
        if (name.contains("kurta") || name.contains("kurti")) return 1199.00;
        if (name.contains("dress"))           return 1599.00;
        if (name.contains("t-shirt") || name.contains("tshirt")) return 799.00;
        if (name.contains("leggings"))        return 699.00;
        if (name.contains("jacket"))          return 2499.00;
        if (name.contains("sweater") || name.contains("hoodie")) return 1499.00;
        if (name.contains("trouser") || name.contains("pant")) return 1299.00;
        if (name.contains("skirt"))           return 999.00;
        if (name.contains("top"))             return 899.00;
        // default fallback
        return 1299.00;
    }
}
