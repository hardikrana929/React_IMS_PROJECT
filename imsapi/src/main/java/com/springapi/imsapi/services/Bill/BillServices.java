package com.springapi.imsapi.services.Bill;

import java.util.List;

import com.springapi.imsapi.entities.GenerateBill;

public interface BillServices {
	
	public List<GenerateBill> getAllBill(GenerateBill gbill); 
	public GenerateBill createBill(GenerateBill gbill);
	public GenerateBill UpdateBill(Long billId, GenerateBill gbill);
	public void deleteBill(Long billId);

}
