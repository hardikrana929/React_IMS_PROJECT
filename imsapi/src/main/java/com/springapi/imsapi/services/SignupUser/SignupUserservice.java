package com.springapi.imsapi.services.SignupUser;

import java.util.List;

import com.springapi.imsapi.entities.SignupUser;

public interface SignupUserservice {
	
	public SignupUser addUser(SignupUser suser);
	public List<SignupUser> getAllUsers();
	public void deleteUser(Integer uid);
	public SignupUser updateUser(SignupUser suser);
	
}
