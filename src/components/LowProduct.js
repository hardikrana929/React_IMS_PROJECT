// Import React hooks
import { useEffect, useState } from "react";

// Import axios for API calls
import axios from "axios";

// Import base API URL
import { bash_url } from "../apiservices/Url";

// Number of rows per page
const ITEMS_PER_PAGE = 5;

// Low stock product component
const LowProduct = () => {

  // State to store low stock products
  const [products, setProducts] = useState([]);

  // State for search input
  const [search, setSearch] = useState("");

  // State for sorting order
  const [sortOrder, setSortOrder] = useState("asc");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Load data on component mount
  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  // Fetch all products and filter low stock
  const fetchLowStockProducts = async () => {
    try {
      // API call to get products
      const res = await axios.get(`${bash_url}/product`);

      // Filter products where quantity is less than or equal to low stock level
      const filtered = res.data.filter(
        (p) => p.pqty <= p.lstock
      );

      // Store filtered products in state
      setProducts(filtered);
    } catch (err) {
      // Handle error
      console.log("Error loading low stock products", err);
    }
  };

  // Filter products based on search text
  const filteredProducts = products.filter((p) =>
    p.pname.toLowerCase().includes(search.toLowerCase())
  );

  // Sort products by ID
  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.pid - b.pid : b.pid - a.pid
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  // Calculate start index for pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Slice data for current page
  const paginatedData = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Component UI
  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">

        {/* Card Header */}
        <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Low Stock Products
          </h4>

          {/* Total count badge */}
          <span className="badge bg-light text-danger">
            {products.length}
          </span>
        </div>

        {/* Card Body */}
        <div className="card-body">

          {/* Search & Sort Section */}
          <div className="row mb-3">

            {/* Search input */}
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product name"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="col-md-3 ms-auto">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Sort by ID ↑</option>
                <option value="desc">Sort by ID ↓</option>
              </select>
            </div>
          </div>

          {/* If no low stock products */}
          {paginatedData.length === 0 ? (
            <div className="alert alert-success text-center">
              <i className="bi bi-check-circle-fill me-2"></i>
              All products are sufficiently stocked
            </div>
          ) : (
            // Low stock products table
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">

                {/* Table Header */}
                <thead className="table-dark text-center">
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Description</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {paginatedData.map((p) => (
                    <tr key={p.pid}>
                      <td className="text-center">{p.pid}</td>
                      <td>
                        <i className="bi bi-box-seam me-2 text-primary"></i>
                        {p.pname}
                      </td>
                      <td className="text-center">₹ {p.pmrp}</td>
                      <td className="text-center text-danger fw-bold">
                        <i className="bi bi-arrow-down-circle me-1"></i>
                        {p.pqty}
                      </td>
                      <td>{p.pdesc}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          {/* Pagination Section */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">

                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
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

                {/* Next button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages && "disabled"
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>

              </ul>
            </nav>
          )}

        </div>
      </div>
    </div>
  );
};

// Export component
export default LowProduct;
