import axios from "axios";
import React, { useEffect, useState } from "react";
import { Signup_Url } from "../apiservices/SignupUrl";
import { toast } from "react-toastify";

const Category = () => {

  //  STATE MANAGEMENT

  // Table data (ARRAY)
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectId, setSelectId] = useState(null);
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCategories = categories.filter((cat) =>
    cat.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.cdesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key].toLowerCase();
    const bVal = b[sortConfig.key].toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  // sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form data (OBJECT)
  const [category, setCategory] = useState({
    cid: "",
    cname: "",
    cdesc: ""
  });

  // Modal open / close
  const [showModal, setShowModal] = useState(false);


  //This function is used to fill update form automaticaly....
  const handleEditOperation = (selectId) => {
    axios.get(`${Signup_Url}/category/${selectId}`).then(
      (response) => {
        setCategory(response.data); //Using this line fill form automaticaly...
        setSelectId(selectId);
        setIsEdit(true);
        setShowModal(true);
      }, (error) => {
        toast.error("Opps! server problem...")
      }
    );
  };

  //  FETCH CATEGORY LIST
  const fetchCategoryFromServer = () => {
    axios.get(`${Signup_Url}/category`).then(
      (response) => {
        setCategories(response.data); // set array for table
      },
      (error) => {
        console.log("Error Occurred", error);
      }
    );
  };
  // Load data on page load
  useEffect(() => {
    fetchCategoryFromServer();
  }, []);

  //  HANDLE FORM INPUT CHANGE


  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value
    });
  };

  //modle close function
  const cloaseModel = () => {
    setShowModal(false);
    setIsEdit(false);
    setSelectId(null);
    setCategory({ cid: "", cname: "", cdesc: "" });
  }

  //When category delete then filter table
  // const showafterDelete = (cId) => {
  //   setCategories(prev => prev.filter((e) => e.cId !== cId));
  // };

  //Delete category from server
  const deleteCategory = (cId) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    axios.delete(`${Signup_Url}/category/${cId}`).then(
      (response) => {
        fetchCategoryFromServer();
        toast.success("Category delete successfully.");

      }, (error) => {
        toast.error("Opps! Server error");
      }
    )
  }


  //  SUBMIT Function handle
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      axios.put(`${Signup_Url}/category/${selectId}`, category).then(
        (response) => {
          toast.success("Category update Successfully.");
          cloaseModel();
          fetchCategoryFromServer();
        }, (error) => {
          toast.error("Opps! somthing want to wrogn...")
        }
      )
    }
    else {
      axios.post(`${Signup_Url}/category`, category).then(
        () => {
          toast.success("Category Added Successfully");
          // Close modal
          setShowModal(false);
          // Reset form
          setCategory({ cid: "", cname: "", cdesc: "" });
          // Refresh table data
          fetchCategoryFromServer();
        },
        () => {
          toast.error("Failed to add category");
        }
      );
    };
  }

  //  UI RENDER
  return (

    <div className="container py-5">


      {/* CATEGORY TABLE */}

      <div className="card shadow-lg">
        <div className="card-body">

          <h3 className="text-center mb-4 text-primary">
            Category List
          </h3>

          <div className="table-responsive">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="🔍 Search category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>ID</th>
                  <th onClick={() => handleSort("cname")} style={{ cursor: "pointer" }}>
                    Name <i className="bi bi-arrow-down-up"></i>
                  </th>

                  <th onClick={() => handleSort("cdesc")} style={{ cursor: "pointer" }}>
                    Description <i className="bi bi-arrow-down-up"></i>
                  </th>

                  {/* <th>Name</th> */}
                  {/* <th>Description</th> */}
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {categories.length > 0 ? (
                  paginatedCategories.map((cat, index) => (
                    <tr key={index}>
                      <td>{cat.cid}</td>
                      <td>{cat.cname}</td>
                      <td>{cat.cdesc}</td>
                      <td>
                        <button className="btn btn-outline-warning"
                          onClick={() => handleEditOperation(cat.cid)}
                        ><i className="bi bi-pencil-square"></i></button>
                      </td>
                      <td>
                        <button className="btn btn-outline-danger"
                          onClick={() => deleteCategory(cat.cid)}
                        ><i className="bi bi-trash3"></i></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted fw-bold">
                      No Category Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">

              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>

            </ul>
          </nav>

        </div>
      </div>


      {/* PLUS BUTTON (BOTTOM RIGHT) */}

      <button
        className="btn btn-success position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: "55px", height: "55px" }}
        onClick={() => setShowModal(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" viewBox="0 0 16 16">
          <path d="M8 4v8M4 8h8" stroke="white" strokeWidth="2" />
        </svg>
      </button>


      {/* ADD CATEGORY MODAL */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">

              {/* Modal Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-tags me-2"></i>
                  {isEdit ? "Update Category" : "Add Category"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={cloaseModel}
                ></button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">

                  {/* Category Name */}
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-tag-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="cname"
                        placeholder="Enter category name"
                        value={category.cname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Category Description */}
                  <div className="mb-3">
                    <label className="form-label">Category Description</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-card-text"></i>
                      </span>
                      <textarea
                        className="form-control"
                        name="cdesc"
                        placeholder="Enter short description"
                        rows="3"
                        value={category.cdesc}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save"></i> Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cloaseModel}
                  >
                    <i className="bi bi-x-circle"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


    </div>

  );
};

export default Category;
