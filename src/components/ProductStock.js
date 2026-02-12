import React, { useState, useEffect } from "react";
import axios from "axios";
import { bash_url } from "../apiservices/Url";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const LowStock = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ===================== STATE MANAGEMENT ===================== */

  // Main product list from API
  const [products, setProducts] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("pid"); // pid | pqty
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ===================== API CALL ===================== */

  const getAllProducts = () => {
    axios
      .get(`${bash_url}/product`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load products");
      });
  };

  useEffect(() => {
    document.title = "Stock Products";
    getAllProducts();
  }, []);

  useEffect(() => {
    if (location.state?.referesh) {
      getAllProducts();
    }
  }, [location.state]);

  /* ===================== DELETE PRODUCT ===================== */

  const deleteProduct = (pid) => {
    axios
      .delete(`${bash_url}/product/${pid}`)
      .then(() => {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p.pid !== pid));
      })
      .catch(() => {
        toast.error("Delete failed");
      });
  };

  /* ===================== SEARCH ===================== */

  const filteredProducts = products.filter((p) =>
    p.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pid.toString().includes(searchTerm)
  );

  /* ===================== SORTING ===================== */

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  /* ===================== PAGINATION ===================== */

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  /* ===================== UI ===================== */

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-body">

          {/* TITLE */}
          <h3 className="text-center text-primary mb-4">
            Stock Products
          </h3>

          {/* SEARCH + SORT BAR */}
          <div className="row mb-4 align-items-center g-2">

            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by ID, Name or Category"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={sortField}
                onChange={(e) => {
                  setSortField(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="pid">Sort by Product ID</option>
                <option value="pqty">Sort by Quantity</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">⬆ Ascending</option>
                <option value="desc">⬇ Descending</option>
              </select>
            </div>

            <div className="col-md-2 text-end fw-semibold text-muted">
              {sortedProducts.length} Results
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Low Limit</th>
                  <th>Description</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((p) => (
                    <tr key={p.pid}>
                      <td>{p.pid}</td>
                      <td>{p.pname}</td>
                      <td>{p.pcategory}</td>
                      <td
                        className={`fw-bold ${p.pqty <= p.lstock ? "text-danger" : "text-success"
                          }`}
                      >
                        {p.pqty}
                        {p.pqty <= p.lstock && (
                          <span className="badge bg-danger ms-2">Low</span>
                        )}
                      </td>
                      <td>{p.pmrp}</td>
                      <td>{p.lstock}</td>
                      <td>{p.pdesc}</td>
                      <td>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() =>
                            navigate(`/edit-product/${p.pid}`, {
                              state: { referesh: true },
                            })
                          }
                        >
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteProduct(p.pid)}
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="fw-bold text-muted">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination pagination-sm">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 && "active"
                      }`}
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

      {/* ADD PRODUCT BUTTON */}
      <button
        className="btn btn-success position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: "55px", height: "55px" }}
        onClick={() => navigate("/addproduct")}
      >
        +
      </button>
    </div>
  );
};

export default LowStock;
