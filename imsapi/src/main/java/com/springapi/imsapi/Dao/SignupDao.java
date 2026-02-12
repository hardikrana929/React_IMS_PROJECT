package com.springapi.imsapi.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springapi.imsapi.entities.SignupUser;

public interface SignupDao extends JpaRepository<SignupUser, Integer>{

}
