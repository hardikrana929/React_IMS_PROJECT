package com.springapi.imsapi.services.product;

import java.util.List;

import com.springapi.imsapi.entities.Product;

public interface ProductServices {

	public List<Product> getProductData();
	public Product getProduct(long pId);
	public Product addProduct(Product product);
	public Product changeProduct(Long pId,Product product);
	public void deleteProduct(long pId);
}
