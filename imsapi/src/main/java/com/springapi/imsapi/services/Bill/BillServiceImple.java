package com.springapi.imsapi.services.Bill;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springapi.imsapi.Dao.BillDao;
import com.springapi.imsapi.Dao.ProductDao;
import com.springapi.imsapi.entities.BillItems;
import com.springapi.imsapi.entities.GenerateBill;
import com.springapi.imsapi.entities.Product;

import jakarta.transaction.Transactional;

@Service
public class BillServiceImple implements BillServices {

	@Autowired
	private BillDao billdao;

	@Autowired
	private ProductDao productdao;

//	fetch all rows
	@Override
	public List<GenerateBill> getAllBill(GenerateBill gbill) {
		return billdao.findAll();
	}

//	insert bill data
	@Override
	@Transactional
	public GenerateBill createBill(GenerateBill gbill) {

		for (BillItems item : gbill.getItems()) {
			item.setBill(gbill); 
		}

		for (BillItems item : gbill.getItems()) {

			Product product = productdao.findByPname(item.getName())
					.orElseThrow(() -> new RuntimeException("Product not found: " + item.getName()));

			if (product.getPqty() < item.getQuantity()) {
				throw new RuntimeException("Insufficient stock for product: " + product.getPname());
			}

			product.setPqty(product.getPqty() - item.getQuantity());
			productdao.save(product);
		}

		return billdao.save(gbill);
	}

//	Update Bill
	@Override
	@Transactional
	public GenerateBill UpdateBill(Long billId, GenerateBill newBill) {

		GenerateBill oldBill = billdao.findById(billId).orElseThrow(() -> new RuntimeException("Bill not found"));

		//Restore old stock
		for (BillItems oldItem : oldBill.getItems()) {
			Product product = productdao.findByPname(oldItem.getName())
					.orElseThrow(() -> new RuntimeException("Product not found: " + oldItem.getName()));

			product.setPqty(product.getPqty() + oldItem.getQuantity());
			productdao.save(product);
		}
		for (BillItems item : newBill.getItems()) {
			item.setBill(newBill);
		}

		//Reduce new stock
		for (BillItems newItem : newBill.getItems()) {
			Product product = productdao.findByPname(newItem.getName())
					.orElseThrow(() -> new RuntimeException("Product not found: " + newItem.getName()));

			if (product.getPqty() < newItem.getQuantity()) {
				throw new RuntimeException("Insufficient stock for " + product.getPname());
			}

			product.setPqty(product.getPqty() - newItem.getQuantity());
			productdao.save(product);
		}

		newBill.setBillId(billId);
		return billdao.save(newBill);
	}

//	@Override
//	public GenerateBill UpdateBill(Long billId, GenerateBill gbill) {
//		Optional<GenerateBill> existBill = billdao.findById(billId);
//		if (existBill.isPresent()) {
//			GenerateBill gb = existBill.get();
//			gbill.setBillId(gbill.getBillId());
//			gbill.setCustomerName(gbill.getCustomerName());
//			gbill.setBillDate(gbill.getBillDate());
//			gbill.setContact(gbill.getContact());
//			gbill.setDueDate(gbill.getDueDate());
//			gbill.setIssuedBy(gbill.getIssuedBy());
//			gbill.setItems(gbill.getItems());
//			gbill.setPayBy(gbill.getPayBy());
//		}
//		return billdao.save(gbill);
//	}

//	Delete Bill
	@Override
	public void deleteBill(Long billId) {

		GenerateBill gb = billdao.getOne(billId);
		billdao.delete(gb);

	}

}
