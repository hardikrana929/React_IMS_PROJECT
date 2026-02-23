import React, { useState, useEffect } from "react";
import { bash_url } from "../apiservices/Url";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Signup_Url } from "../apiservices/SignupUrl";

const AddProduct = () => {

  const { pid } = useParams();
  const navigete = useNavigate();
  const [isUpdate, setIsUpdate] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    pid: "",
    pname: "",
    pmrp: "",
    pqty: "",
    pcategory: "",
    lstock: "",
    pdesc: ""
  });


  const fetchProductFromServer = () => {
    //Fetch Product Id from server for update form 
    if (pid) {
      setIsUpdate(true);
      axios.get(`${bash_url}/product/${pid}`).then(
        (response) => {
          setProduct(response.data);
        }, (error) => {
          console.log("Opps!Error Occure");
        }
      );
    }
  }
  useEffect(() => {
    document.title = pid ? "Update Product" : "Add Product";
    fetchProductFromServer();
  }, [pid]);

  //fetch category for show dynamicaly
  const fetchCategory = () => {
    axios.get(`${Signup_Url}/category`).then(
      (response) => {
        setCategories(response.data);
        fetchProductFromServer();
      }, (error) => {
        toast.error("Opps! server Error...");
      }
    )
  }

  useEffect(() => {
    fetchCategory();
  }, [])

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
    if (isUpdate) {
      updateDataFromServer(product);
      fetchProductFromServer();
    } else {
      postDatatoServer(product);
      toast.success("Product Added Successfully");
      fetchProductFromServer();
    }
    navigete("/lowstock", {
      state: { referesh: true }
    });
  };

  //Update Data into server
  const updateDataFromServer = (data) => {
    axios.put(`${bash_url}/product/${data.pid}`, data).then(
      (response) => {
        toast.success("Product Update Successfully.")
        fetchProductFromServer();
        navigete('/lowstock');
      },
      (error) => {
        toast.error("Update Failed")
        console.log(error)
      }
    )
  }
  //Insert data into server
  const postDatatoServer = (data) => {
    axios.post(`${bash_url}/product`, data).then(
      (response) => {
        console.log(response)
        console.log("Success");
        navigete('/lowstock')
      }, (error) => {
        console.log("Error occure : ", error);
      }
    )

  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg">
            <div className="card-body">

              <h3 className="text-center mb-4">Add Product</h3>
              <form onSubmit={handleSubmit}>

                {/* Product ID & Name */}
                <div className="row mb-3">

                  <div className="col-md-6">
                    <label className="form-label">Product ID</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-upc-scan"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="pid"
                        placeholder="Enter Product ID"
                        value={product.pid}
                        onChange={handleChange}
                        disabled={isUpdate}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Product Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-box"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="pname"
                        placeholder="Enter Product Name"
                        value={product.pname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Quantity & MRP */}
                <div className="row mb-3">

                  <div className="col-md-6">
                    <label className="form-label">Product Quantity</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-stack"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        name="pqty"
                        placeholder="Available Quantity"
                        value={product.pqty}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">MRP (₹)</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-currency-rupee"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        name="pmrp"
                        placeholder="Product Price"
                        value={product.pmrp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Category & Low Stock */}
                <div className="row mb-3">

                  <div className="col-md-6">
                    <label className="form-label">
                      Category&nbsp;
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success ms-2"
                        onClick={() => navigete("/category")}
                      >
                        <i className="bi bi-plus-circle"></i> Add
                      </button>
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-tags"></i>
                      </span>
                      <select
                        className="form-select"
                        name="pcategory"
                        value={product.pcategory}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.cid} value={cat.cname}>
                            {cat.cname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Low Stock Alert</label>
                    <div className="input-group">
                      <span className="input-group-text text-warning">
                        <i className="bi bi-exclamation-triangle"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        name="lstock"
                        placeholder="Low stock limit"
                        value={product.lstock}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label">Product Description</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-card-text"></i>
                    </span>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="pdesc"
                      placeholder="Enter product description"
                      value={product.pdesc}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save"></i>
                    &nbsp;{isUpdate ? "Update Product" : "Add Product"}
                  </button>
                  <button type="reset" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-counterclockwise"></i> Reset
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigete('/lowstock')}>
                    {/* <i className="bi bi-x-circle"></i> */} Back
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default AddProduct;
