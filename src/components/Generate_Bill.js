import { useState, useEffect } from "react";
import axios from "axios";
import { Signup_Url } from "../apiservices/SignupUrl";
import { toast } from "react-toastify";
import "../css/bill-print.css";

// --- Initial States (Blank values for reset) ---
const initialCustomer = {
  name: "",
  date: "",
  dueDate: "",
  issuedBy: "",
  payBy: "",
  contact: "",
};

const initialProduct = {
  name: "",
  quantity: "",
  price: "",
};

const GenerateBill = () => {
  // --- State Management ---
  const [customer, setCustomer] = useState(initialCustomer);
  const [product, setProduct] = useState(initialProduct);
  const [items, setItems] = useState([]); // List of products added to the current bill
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false); // Toggle for the input form
  const [bills, setBills] = useState([]); // List of all bills fetched from server
  const [editBillId, setEditBillId] = useState(null); // Tracks if we are updating an existing bill
  const [invoiceNo, setInvoiceNo] = useState("");
  // --- Search, Sort & Pagination States ---
  const [searchTerm, setSearchTerm] = useState(""); // customer search
  const [sortOrder, setSortOrder] = useState("desc"); // id sorting
  const [currentPage, setCurrentPage] = useState(1); // pagination
  const recordsPerPage = 5; // rows per page


  // --- Calculate Grand Total ---
  const grandTotal = items.reduce((sum, i) => sum + i.total, 0);

  // --- Effect: Load bills when the page opens ---
  useEffect(() => {
    fetchBills();
  }, []);
  // --- Filter by customer name ---
  const filteredBills = bills.filter(b =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Sort by billId ---
  const sortedBills = [...filteredBills].sort((a, b) =>
    sortOrder === "asc" ? a.billId - b.billId : b.billId - a.billId
  );

  // --- Pagination logic ---
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedBills = sortedBills.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(sortedBills.length / recordsPerPage);


  // --- API Functions ---

  // 1. Fetch all bills from the server
  const fetchBills = async () => {
    try {
      const res = await axios.get(`${Signup_Url}/bill`);
      setBills(res.data);
    } catch (err) {
      toast.error("Failed to load bills list.");
    }
  };

  // 2. Reset form to default state
  const resetForm = () => {
    setCustomer(initialCustomer);
    setProduct(initialProduct);
    setItems([]);
    setEditBillId(null);
    setErrors({});
    setShowForm(false);
    fetchBills(); // Refresh the list
  };

  // 3. Delete a bill
  const handleDeleteBill = (billId) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    axios.delete(`${Signup_Url}/bill/${billId}`).then(
      () => {
        toast.success("Bill deleted successfully.");
        fetchBills();
      },
      () => toast.error("Delete failed.")
    );
  };

  // --- Validation Logic ---

  const validateCustomer = () => {
    const err = {};

    if (!customer.name) err.name = "Customer name is required";

    if (!customer.date) {
      err.date = "Issue date is required";
    }

    if (!customer.dueDate) {
      err.dueDate = "Due date is required";
    } else if (customer.date && customer.dueDate < customer.date) {
      err.dueDate = "Due date cannot be before issue date";
    }

    if (!customer.issuedBy) err.issuedBy = "Issuer name is required";
    if (!customer.payBy) err.payBy = "Payment method is required";

    if (!/^\d{10}$/.test(customer.contact)) {
      err.contact = "Enter 10-digit mobile number";
    }

    return err;
  };


  const validateProduct = () => {
    const err = {};
    if (!product.name) err.pname = "Product name required";
    if (product.quantity <= 0) err.qty = "Qty must be > 0";
    if (product.price <= 0) err.price = "Price must be > 0";
    return err;
  };

  // --- Event Handlers ---

  // Add a product to the temporary items list
  const handleAddItem = () => {
    const err = validateProduct();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    const newItem = {
      ...product,
      total: product.quantity * product.price,
    };
    setItems([...items, newItem]);
    setProduct(initialProduct); // Clear product inputs
    setErrors({});
  };

  // Open form and fill data for editing
  const handleEditBill = (bill) => {
    setCustomer({
      name: bill.customerName,
      date: bill.billDate,
      dueDate: bill.dueDate,
      issuedBy: bill.issuedBy,
      payBy: bill.payBy,
      contact: bill.contact,
    });

    let parsedItems = Array.isArray(bill.items)
      ? bill.items
      : JSON.parse(bill.items || "[]");

    setItems(
      parsedItems.map((p) => ({
        name: p.name,
        quantity: Number(p.quantity),
        price: Number(p.price),
        total: Number(p.quantity) * Number(p.price),
      }))
    );

    setInvoiceNo(bill.billId);
    setEditBillId(bill.billId);
    setShowForm(true);
  };


  // Final Submit: Create or Update
  const handleGenerateBill = (e) => {
    e.preventDefault();

    // Validation
    const err = validateCustomer();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    if (items.length === 0) {
      toast.warn("Please add at least one product.");
      return;
    }

    //Correct payload
    const payload = {
      billDate: customer.date,
      dueDate: customer.dueDate,
      customerName: customer.name,
      contact: customer.contact,
      issuedBy: customer.issuedBy,
      payBy: customer.payBy,
      grandTotal: grandTotal,
      items: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    };

    if (editBillId) {
      // UPDATE bill
      axios
        .put(`${Signup_Url}/bill/${editBillId}`, payload)
        .then(() => {
          toast.success("Bill updated successfully");
          resetForm();
        })
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "Stock not available";

          toast.error(message);
        });
    } else {
      // CREATE bill
      axios
        .post(`${Signup_Url}/bill`, payload)
        .then((response) => {
          setInvoiceNo(response.data.billId);
          toast.success("Bill generated successfully");
          resetForm();
        })
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "Stock not available";

          toast.error(message);
        });
    }
  };



  return (
    <div className="container pt-4 mt-5">
      {/* 1. INPUT FORM SECTION */}
      {showForm && (
        <div className="card shadow-lg mb-5 ">
          <div className="card-header bg-primary text-white d-flex justify-content-between">

            <div><h4 className="mb-0">{editBillId ? "Edit Bill" : "Generate New Bill"}</h4>          </div>
            <button type="button" className="btn btn-outline-light" onClick={() => setShowForm(false)}>
              <i className="bi bi-x-circle"></i>
            </button>
          </div>

          <form className="card-body" onSubmit={handleGenerateBill}>
            <h5 className="mb-3 text-secondary border-bottom pb-2">
              <i className="bi bi-person-lines-fill me-2"></i>Customer Details
            </h5>

            <div className="row g-3">
              {/* Customer Name */}
              <div className="col-md-6">
                <label className="form-label">Customer Name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person"></i></span>
                  <input
                    placeholder="Enter full name"
                    className={`form-control ${errors.name && "is-invalid"}`}
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>
              </div>

              {/* Bill Date */}
              <div className="col-md-3">
                <label className="form-label">Bill Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar-date"></i></span>
                  <input
                    type="date"
                    className={`form-control ${errors.date && "is-invalid"}`}
                    value={customer.date}
                    onChange={(e) => setCustomer({ ...customer, date: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.date}</div>

                </div>
              </div>

              {/* Due Date */}
              <div className="col-md-3">
                <label className="form-label">Due Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                  <input
                    type="date"
                    className={`form-control ${errors.dueDate && "is-invalid"}`}
                    value={customer.dueDate}
                    onChange={(e) => setCustomer({ ...customer, dueDate: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.dueDate}</div>

                </div>
              </div>

              {/* Issued By */}
              <div className="col-md-4">
                <label className="form-label">Issued By</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                  <input
                    placeholder="Staff name"
                    className="form-control"
                    value={customer.issuedBy}
                    onChange={(e) => setCustomer({ ...customer, issuedBy: e.target.value })}
                  />
                </div>
              </div>

              {/* Pay By */}
              <div className="col-md-4">
                <label className="form-label">Pay By</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-credit-card"></i></span>
                  <input
                    placeholder="Cash / UPI / Card"
                    className="form-control"
                    value={customer.payBy}
                    onChange={(e) => setCustomer({ ...customer, payBy: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="col-md-4">
                <label className="form-label">Contact</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                  <input
                    type="text"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    className={`form-control ${errors.contact && "is-invalid"}`}
                    value={customer.contact}
                    onChange={(e) => setCustomer({ ...customer, contact: e.target.value })}
                  />
                  <div className="invalid-feedback">{errors.contact}</div>
                </div>
              </div>
            </div>

            <h5 className="mb-3 mt-4 text-secondary border-bottom pb-2">
              <i className="bi bi-cart-plus me-2"></i>Add Items
            </h5>

            <div className="row g-3 align-items-end">
              {/* Product Name */}
              <div className="col-md-5">
                <label className="form-label">Product Name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-box"></i></span>
                  <input
                    placeholder="Product name"
                    className={`form-control ${errors.pname && "is-invalid"}`}
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="col-md-3">
                <label className="form-label">Quantity</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-stack"></i></span>
                  <input
                    type="number"
                    placeholder="Qty"
                    className={`form-control ${errors.qty && "is-invalid"}`}
                    value={product.quantity}
                    onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="col-md-3">
                <label className="form-label">Price</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-currency-rupee"></i></span>
                  <input
                    type="number"
                    placeholder="Unit price"
                    className={`form-control ${errors.price && "is-invalid"}`}
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Add Button */}
              <div className="col-md-1 d-grid">
                <button type="button" className="btn btn-success" onClick={handleAddItem}>
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>


            {/* List of items added to current bill */}
            <div className="table-responsive mt-4">
              <table className="table table-sm table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i, idx) => (
                    <tr key={idx}>
                      <td>{i.name}</td>
                      <td>{i.quantity}</td>
                      <td>{i.price}</td>
                      <td>{i.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h4 className="text-primary">
                <i className="bi bi-receipt me-2"></i>Total: ₹ {grandTotal}
              </h4>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary px-4">
                  <i className="bi bi-save"></i> Save Bill
                </button>
                {/* <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-circle"></i> Cancel
                </button> */}
                <button type="button" className="btn btn-outline-dark" onClick={() => window.print()}>
                  <i className="bi bi-printer"></i> Print
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* 2. HISTORY TABLE SECTION */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Previous Bills</h5>
          {/* <button className="btn btn-light" onClick={() => setShowForm(true)}>+ New Bill</button> */}
          <div className="d-flex gap-2">
            {/* Search by customer */}
            <div className="input-group input-group-sm">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search customer"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Sort by ID */}
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <i className={`bi ${sortOrder === "asc" ? "bi-sort-numeric-down" : "bi-sort-numeric-up"}`}></i>
            </button>
          </div>

        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Pay Method</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-3"></i><br />No records found
                  </td>
                </tr>
              ) : (
                paginatedBills.map((bill) => (
                  <tr key={bill.billId}>
                    <td className="fw-bold">{bill.billId}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.contact}</td>
                    <td><span className="badge bg-info">{bill.payBy}</span></td>
                    <td>{bill.billDate}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditBill(bill)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBill(bill.billId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Centered pagination */}
<div className="d-flex justify-content-center my-3">
  <nav>
    <ul className="pagination pagination-sm mb-0">

      {/* Previous */}
      <li className={`page-item ${currentPage === 1 && "disabled"}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      </li>

      {/* Page numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <li
          key={index}
          className={`page-item ${currentPage === index + 1 && "active"}`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}

      {/* Next */}
      <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </li>

    </ul>
  </nav>
</div>

        </div>
      </div>

      {/* 3. FLOATING ACTION BUTTON */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg"
        style={{ width: "60px", height: "60px", bottom: "30px", right: "30px" }}
        onClick={() => { setShowForm(true); setEditBillId(null); }}
      >
        <i className="bi bi-plus-lg fs-3"></i>
      </button>

      {/* 4. HIDDEN PRINT LAYOUT (Visible only during printing) */}
      <div className="print-area d-none d-print-block p-4">
        <h2 className="text-center">INVOICE</h2>
        <hr />
        <div className="row">
          <div className="col-6">
            <p><strong>Invoice No:</strong> {invoiceNo}</p>
            <p><strong>Customer:</strong> {customer.name}</p>
            <p><strong>Contact:</strong> {customer.contact}</p>
          </div>
          <div className="col-6 text-end">
            <p><strong>Date:</strong> {customer.date}</p>
            <p><strong>DueDate:</strong> {customer.dueDate}</p>
            <p><strong>Issued By:</strong> {customer.issuedBy}</p>
          </div>
        </div>
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>₹{p.price}</td>
                <td>₹{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-end">Grand Total: ₹ {grandTotal}</h3>
      </div>
    </div>
  );
};
export default GenerateBill;
