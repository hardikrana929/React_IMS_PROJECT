package com.springapi.imsapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springapi.imsapi.entities.GenerateBill;
import com.springapi.imsapi.services.Bill.BillServices;

@RestController
@RequestMapping("/ims")
//@CrossOrigin("*")
public class BillController {
	
	@Autowired
	private BillServices billservices;
	
//	@GetMapping("/bill")
//	public String display() {
//		return "Bill generated successfully....";
//	}
	
	@GetMapping("/bill")
	public List<GenerateBill> getAllBill(GenerateBill gbill){
		return this.billservices.getAllBill(gbill);
	}
	@PostMapping("/bill")
	public GenerateBill addBill(@RequestBody GenerateBill gbill) {		
		return this.billservices.createBill(gbill);
	}
	

	@PutMapping("/bill/{billId}")
	public GenerateBill UpdateBill(@PathVariable Long billId, @RequestBody GenerateBill gbill) {
		return this.billservices.UpdateBill(billId,gbill);
	}
	
	@DeleteMapping("/bill/{billId}")
	public ResponseEntity<String> deleteBill(@PathVariable Long billId){
		billservices.deleteBill(billId);
		return ResponseEntity.ok("Bill Remove Successfully.");
	}
	
}
