package com.springapi.imsapi.Dao;
import org.springframework.data.jpa.repository.JpaRepository;
import com.springapi.imsapi.entities.GenerateBill;

public interface BillDao extends JpaRepository<GenerateBill, Long>{

}
