package com.springapi.imsapi.services.category;

import java.util.*;

import com.springapi.imsapi.entities.ItemsCategory;

public interface CategoryService {

	public List<ItemsCategory> getCategory();
	public ItemsCategory addCategory(ItemsCategory itemscat);
	public ItemsCategory updateCategory(ItemsCategory itemscat, Integer cId);
	public void deleteCategory(Integer cId);
	public ItemsCategory getOneRow(Integer cId);
}
