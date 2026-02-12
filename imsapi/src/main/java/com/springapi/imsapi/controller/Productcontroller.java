package com.springapi.imsapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.springapi.imsapi.entities.Product;
import com.springapi.imsapi.services.product.ProductServices;

import java.util.*;

//Rest = "Rest stands for Representation state transfer"
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class Productcontroller {

	@Autowired
	private ProductServices productservices;

	// Fetch Multiple Values
	@GetMapping("/product")
	public List<Product> getProductData() {
		return this.productservices.getProductData();
	}

	// Fetch Single value
	@GetMapping("/product/{pId}")
	public Product getProduct(@PathVariable String pId) {
		return this.productservices.getProduct(Long.parseLong(pId));
	}

	// Insert data
	@PostMapping("/product")
	public Product addProduct(@RequestBody Product product) {
		return this.productservices.addProduct(product);
	}

	// Update data
	@PutMapping("/product/{pId}")
	public Product changeProduct(@PathVariable String pId, @RequestBody Product product) {
		return this.productservices.changeProduct(Long.parseLong(pId), product);
	}

	// Delete data
	@DeleteMapping("/product/{pId}")
	public ResponseEntity<HttpStatus> deleteProduct(@PathVariable String pId) {
		try {
			this.productservices.deleteProduct(Long.parseLong(pId));
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
