import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bash_url } from "../apiservices/Url";
import { Signup_Url } from "../apiservices/SignupUrl";
import axios from "axios";
const SummaryCards = () => {
  const navigate = useNavigate();

  //Initialize state for get data from api 
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  useEffect(() => {
    fetchTotalProduct();
    fetchTotalCategory();
    fetchTotalLowStock();
  })


  //Find length of Product
  const fetchTotalProduct = () => {
    axios.get(`${bash_url}/product`).then(
      (response) => {
        setTotalProduct(response.data.length);
        
      }, (error) => {
        console.error("Error Occure : ", error);

      }
    )
  }

  //Find length of Category
  const fetchTotalCategory = () => {
    axios.get(`${Signup_Url}/category`).then(
      (response) => {
        setTotalCategory(response.data.length);
        
      }, (error) => {
        console.error("Error Occure : ", error);
      }
    )
  }

  //Find length of Low stock
  const fetchTotalLowStock = () => {
    axios.get(`${bash_url}/product`).then(
      (response) => {
        // setTotalCategory(response.data.length);
        const filterToLowStock = response.data.filter(
          (p) => p.pqty <= p.lstock
        );
        setLowStock(filterToLowStock.length);
      }, (error) => {
        console.error("Error Occure : ", error);
      }
    )
  }

  return (
    <div className="row mb-3">

      <div className="col-md-4">
        <div
          className="card text-bg-primary summary-card"
          role="button"
          onClick={() => navigate("/lowstock")}
        >
          <div className="card-body">
            <h5>
              <i className="bi bi-box-seam me-2"></i>
              Total Products
            </h5>
            <h3>{totalProduct}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div
          className="card text-bg-success summary-card"
          role="button"
          onClick={() => navigate("/category")}
        >
          <div className="card-body">
            <h5>
              <i className="bi bi-tags me-2"></i>
              Total Categories
            </h5>
            <h3>{totalCategory}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div
          className="card text-bg-danger summary-card"
          role="button"
          onClick={() => navigate("/lowproduct")}
        >
          <div className="card-body">
            <h5>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Low Stock
            </h5>
            <h3>{lowStock}</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SummaryCards;
