import axios from "axios";
import React, { useEffect, useState } from "react";
import { Signup_Url } from "../apiservices/SignupUrl";
import { toast } from "react-toastify";

const Category = () => {

  /* ===================== STATE ===================== */

  // Category list
  const [categories, setCategories] = useState([]);

  // Form state
  const [category, setCategory] = useState({
    cid: "",
    cname: "",
    cdesc: "",
  });

  // Modal & edit
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectId, setSelectId] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting (ONLY BY ID)
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ===================== FETCH DATA ===================== */

  const fetchCategoryFromServer = () => {
    axios
      .get(`${Signup_Url}/category`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  };

  useEffect(() => {
    fetchCategoryFromServer();
  }, []);

  /* ===================== SEARCH ===================== */

  const filteredCategories = categories.filter(
    (cat) =>
      cat.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.cdesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ===================== SORT (ONLY BY ID) ===================== */

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    return sortOrder === "asc" ? a.cid - b.cid : b.cid - a.cid;
  });

  /* ===================== PAGINATION ===================== */

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ===================== FORM HANDLERS ===================== */

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setSelectId(null);
    setCategory({ cid: "", cname: "", cdesc: "" });
  };

  const handleEditOperation = (id) => {
    axios.get(`${Signup_Url}/category/${id}`).then(
      (res) => {
        setCategory(res.data);
        setSelectId(id);
        setIsEdit(true);
        setShowModal(true);
      },
      () => toast.error("Server error")
    );
  };

  const deleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    axios.delete(`${Signup_Url}/category/${id}`).then(
      () => {
        toast.success("Category deleted");
        fetchCategoryFromServer();
      },
      () => toast.error("Delete failed")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      axios.put(`${Signup_Url}/category/${selectId}`, category).then(
        () => {
          toast.success("Category updated");
          closeModal();
          fetchCategoryFromServer();
        },
        () => toast.error("Update failed")
      );
    } else {
      axios.post(`${Signup_Url}/category`, category).then(
        () => {
          toast.success("Category added");
          closeModal();
          fetchCategoryFromServer();
        },
        () => toast.error("Add failed")
      );
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="container py-5">

      <div className="card shadow-lg">
        <div className="card-body">

          <h3 className="text-center text-primary mb-4">
            Category List
          </h3>

          {/* SEARCH + SORT BAR */}
          <div className="row mb-4 align-items-center">

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search category name or description"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Sort by ID (Ascending)</option>
                <option value="desc">Sort by ID (Descending)</option>
              </select>
            </div>

            <div className="col-md-2 text-end text-muted fw-semibold">
              {sortedCategories.length} Results
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => (
                    <tr key={cat.cid}>
                      <td>{cat.cid}</td>
                      <td>{cat.cname}</td>
                      <td>{cat.cdesc}</td>
                      <td>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleEditOperation(cat.cid)}
                        >
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteCategory(cat.cid)}
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="fw-bold text-muted">
                      No Category Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-3">
              <ul className="pagination pagination-sm">

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
                    className={`page-item ${currentPage === i + 1 && "active"}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${currentPage === totalPages && "disabled"
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>

              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* ADD CATEGORY BUTTON */}
      <button
        className="btn btn-success position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: "55px", height: "55px" }}
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">

              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEdit ? "Update Category" : "Add Category"}
                </h5>
                <button className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">

                  <input
                    type="text"
                    className="form-control mb-3"
                    name="cname"
                    placeholder="Category Name"
                    value={category.cname}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    className="form-control"
                    name="cdesc"
                    placeholder="Category Description"
                    rows="3"
                    value={category.cdesc}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
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
