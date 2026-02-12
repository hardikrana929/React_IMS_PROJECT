package com.springapi.imsapi.services.SignupUser;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springapi.imsapi.Dao.SignupDao;
import com.springapi.imsapi.entities.SignupUser;

@Service
public class SignUpImple implements SignupUserservice{

	@Autowired
	private SignupDao signupdao;
	
	//Insert User
	@Override
	public SignupUser addUser(SignupUser suser) {
		suser.setUid(null);
		return signupdao.save(suser);
	}

	//Fetch all Users
	@Override
	public List<SignupUser> getAllUsers() {
		return signupdao.findAll();
	}

	//Delete User
	@Override
	public void deleteUser(Integer uid) {
		SignupUser sg = signupdao.getOne(uid);
		signupdao.delete(sg);
	}

	//Update User
	@Override
	public SignupUser updateUser(SignupUser suser) {		
		return signupdao.save(suser);
	}
	

}
