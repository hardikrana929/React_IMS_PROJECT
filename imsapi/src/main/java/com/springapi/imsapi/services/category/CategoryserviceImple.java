package com.springapi.imsapi.services.category;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springapi.imsapi.Dao.CategoryDao;
import com.springapi.imsapi.entities.ItemsCategory;
@Service
public class CategoryserviceImple implements CategoryService{
	
	@Autowired
	private CategoryDao categorydao;

	//Fetch all category from database
	@Override
	public List<ItemsCategory> getCategory() {
		
		return categorydao.findAll();
	}

	//Get first row
	@Override
	public ItemsCategory getOneRow(Integer cId) {
		
		return categorydao.getOne(cId);
	}


	//Add category into database
	@Override
	public ItemsCategory addCategory(ItemsCategory itemscat) {
		
		return categorydao.save(itemscat);
	}

	//Update data
	@Override
	public ItemsCategory updateCategory(ItemsCategory itemscat, Integer cId) {
		Optional<ItemsCategory> existingCategory = categorydao.findById(cId);
		if(existingCategory.isPresent()) {
			ItemsCategory icm = existingCategory.get();
			itemscat.setCid(itemscat.getCid());
			itemscat.setCname(itemscat.getCname());
			itemscat.setCdesc(itemscat.getCdesc());			
		}
		return categorydao.save(itemscat);
	}

	//Delete Data
	@Override
	public void deleteCategory(Integer cId) {
		ItemsCategory item = categorydao.getOne(cId);
		categorydao.delete(item);
	}


}
