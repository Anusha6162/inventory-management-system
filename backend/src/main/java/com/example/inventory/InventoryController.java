package com.example.inventory.controller;

import com.example.inventory.entity.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class InventoryController {

    @Autowired
    private ProductRepository repo;

    // 1. Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // 2. Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = repo.findById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // 3. Add new product
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    // 4. Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> productOpt = repo.findById(id);
        if(productOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Product product = productOpt.get();
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        return ResponseEntity.ok(repo.save(product));
    }

    // 5. Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if(!repo.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ===== STEP 1 NEW API LU START =====

    // 6. API 1: Low Stock Alert - 5 kanna takkuva unna stock
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return repo.findByStockQuantityLessThan(5);
    }

    // 7. API 2: Sell Product - Ammithe stock taggutundi
    @PutMapping("/{id}/sell")
    public ResponseEntity<Product> sellProduct(@PathVariable Long id, @RequestParam int quantity) {
        Optional<Product> productOpt = repo.findById(id);

        if(productOpt.isEmpty()){
            return ResponseEntity.notFound().build(); // ID dorakaledu
        }

        Product product = productOpt.get();

        if(product.getStockQuantity() < quantity){
            return ResponseEntity.badRequest().build(); // Stock saripodu
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);
        Product updatedProduct = repo.save(product);

        return ResponseEntity.ok(updatedProduct);
    }

    // 8. API 3: Dashboard - Total stats
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        List<Product> allProducts = repo.findAll();
        long totalProducts = allProducts.size();
        long lowStockCount = repo.findByStockQuantityLessThan(5).size();
        double totalStockValue = allProducts.stream()
                .mapToDouble(p -> p.getPrice() * p.getStockQuantity())
                .sum();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalProducts", totalProducts);
        dashboard.put("lowStockCount", lowStockCount);
        dashboard.put("totalStockValue", totalStockValue);

        return dashboard;
    }
}