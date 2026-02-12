package com.springapi.imsapi.Dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springapi.imsapi.entities.Product;

public interface ProductDao extends JpaRepository<Product, Long>{
	Optional<Product> findByPname(String name);
}
