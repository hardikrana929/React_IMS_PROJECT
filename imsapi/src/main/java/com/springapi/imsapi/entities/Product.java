package com.springapi.imsapi.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
public class Product {

	@Id
	private long pid;
	@Column(nullable = false)
	private String pname;
	@Column(nullable = false)
	private int pmrp;
	@Column(nullable = false)
	private String pdesc;
	@Column(nullable = false)
	private int pqty;
	@Column(nullable = false)
	private String pcategory;
	@Column(nullable = false)
	private int lstock;
	
	
	
	public Product(long pid, String pname, int pmrp, String pdesc, int pqty, String pcategory, int lstock) {
		super();
		this.pid = pid;
		this.pname = pname;
		this.pmrp = pmrp;
		this.pdesc = pdesc;
		this.pqty = pqty;
		this.pcategory = pcategory;
		this.lstock = lstock;
	}
	
	public Product() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	public long getPid() {
		return pid;
	}
	public void setPid(long pid) {
		this.pid = pid;
	}
	public String getPname() {
		return pname;
	}
	public void setPname(String pname) {
		this.pname = pname;
	}
	public int getPmrp() {
		return pmrp;
	}
	public void setPmrp(int pmrp) {
		this.pmrp = pmrp;
	}
	public String getPdesc() {
		return pdesc;
	}
	public void setPdesc(String pdesc) {
		this.pdesc = pdesc;
	}
	public int getPqty() {
		return pqty;
	}
	public void setPqty(int pqty) {
		this.pqty = pqty;
	}
	public String getPcategory() {
		return pcategory;
	}
	public void setPcategory(String pcategory) {
		this.pcategory = pcategory;
	}
	public int getLstock() {
		return lstock;
	}
	public void setLstock(int lstock) {
		this.lstock = lstock;
	}
	@Override
	public String toString() {
		return "Product [pid=" + pid + ", pname=" + pname + ", pmrp=" + pmrp + ", pdesc=" + pdesc + ", pqty=" + pqty
				+ ", pcategory=" + pcategory + ", Lowstock=" + lstock + "]";
	}
	
	
}
