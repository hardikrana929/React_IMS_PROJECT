package com.springapi.imsapi.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "bill_items")
public class BillItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ CORRECT product reference
    private Long productId;

    private String name;
    private int quantity;
    private double price;

    // ❌ Do NOT store total (optional)
    @Transient
    private double total;

    // Optional but recommended
    @ManyToOne
    @JsonIgnore
    private GenerateBill bill;

    public double getTotal() {
        return this.quantity * this.price;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public GenerateBill getBill() {
		return bill;
	}

	public void setBill(GenerateBill bill) {
		this.bill = bill;
	}

	public void setTotal(double total) {
		this.total = total;
	}
    
}
