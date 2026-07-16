package com.example.inventory.controller.repository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @GetMapping("/test")
    public String test() {
        return "Inventory API is working!";
    }
}