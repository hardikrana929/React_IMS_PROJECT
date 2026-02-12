package com.springapi.imsapi.services.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springapi.imsapi.Dao.ProductDao;
import com.springapi.imsapi.entities.Product;

@Service
public class ProductServiceimpl implements ProductServices {

//	List<Product> plist;
	
	@Autowired
	private ProductDao productdao;

//	public ProductServiceimpl() {
//		plist = new ArrayList<Product>();
//		plist.add(new Product(2312,"Mouse",100,"This is First Product"));
//		plist.add(new Product(3242,"keybord",200,"This is Second Product"));
//		plist.add(new Product(8437,"RAM",300,"This is third Product"));
//		plist.add(new Product(3209,"Processor",4000,"This is Fourth Product"));
//	}
	
	//Fetch All data
	@Override
	public List<Product> getProductData() {		
//		return plist;
		return productdao.findAll();
	}

	//Fetch only one data
	@Override
	public Product getProduct(long pId) {		
//		Product p = null;
//		for(Product pro : plist) {
//			if (pro.getPid() == pId) {				
//				p = pro; 
//				break;				
//			}
//		}		
//		return p;
		return productdao.getOne(pId);
	}

	//Add Data
	@Override
	public Product addProduct(Product product) {
//			plist.add(product);
//		return product;
		return productdao.save(product);
		
	}

	//Update data
	@Override
	public Product changeProduct(Long pId,Product product) {				
		Optional<Product> existingProduct = productdao.findById(pId);
		if (existingProduct.isPresent()) {
			Product pro = existingProduct.get();
			product.setPname(product.getPname());
			product.setLstock(product.getLstock());
			product.setPdesc(product.getPdesc());
			product.setPcategory(product.getPcategory());
			product.setPmrp(product.getPmrp());
			product.setPqty(product.getPqty());
		}
		return productdao.save(product);
	}

	//Delete Data
	@Override
	public void deleteProduct(long pId) {
//		plist = this.plist.stream().filter(e -> e.getPid() != pId).collect(Collectors.toList());
		Product pro = productdao.getOne(pId);
		productdao.delete(pro);
	}

}
