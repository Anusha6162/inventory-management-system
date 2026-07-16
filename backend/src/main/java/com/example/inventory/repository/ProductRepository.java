package com.example.inventory.repository;

import com.example.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Step 1 kosam: 5 kanna takkuva stock unna products tevadam
    List<Product> findByStockQuantityLessThan(int quantity);

}