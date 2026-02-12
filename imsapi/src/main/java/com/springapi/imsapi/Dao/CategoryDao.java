package com.springapi.imsapi.Dao;



import org.springframework.data.jpa.repository.JpaRepository;

import com.springapi.imsapi.entities.ItemsCategory;

public interface CategoryDao extends JpaRepository<ItemsCategory, Integer>{

}
