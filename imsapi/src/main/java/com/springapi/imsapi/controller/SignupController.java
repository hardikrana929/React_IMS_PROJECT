package com.springapi.imsapi.controller;

import java.io.ObjectInputFilter.Status;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.springapi.imsapi.entities.SignupUser;
import com.springapi.imsapi.services.SignupUser.SignupUserservice;

@RestController
@RequestMapping("/ims")
@CrossOrigin(origins = "http://localhost:3000")
public class SignupController {

	@Autowired
	private SignupUserservice signupservice;
	
//	@GetMapping("/signup")
//	public String dis() {
//		return "This is Signup Controller";
//	}
	
	@GetMapping("/signup")
	public List<SignupUser> getUsers(){		
		return this.signupservice.getAllUsers();
	}
	
	//Insert data
	@PostMapping("/signupuser")
	public SignupUser addUsers(@RequestBody SignupUser suser) {		
		return this.signupservice.addUser(suser);		
	}
	
	
	@PutMapping("/signup")
	public SignupUser updateUser(@RequestBody SignupUser suser) {
		
		return this.signupservice.updateUser(suser);
	}
	
	//DELETE DATA
	@DeleteMapping("/signup/{uid}")
	public ResponseEntity<HttpStatus> deleteUser(@PathVariable Integer uid) {
		try {
			this.signupservice.deleteUser(uid);
			return new ResponseEntity<>(HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
}
