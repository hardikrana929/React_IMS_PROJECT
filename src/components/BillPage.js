import { useEffect, useState } from "react";
import axios from "axios";
import { Signup_Url } from "../apiservices/SignupUrl";
import GenerateBill from "./GenerateBill";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

/*
  This component:
  - Shows + button on left
  - Shows bill list table on right
  - Opens GenerateBill form for ADD / EDIT
*/

const BillPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [bills, setBills] = useState([]);
  const [editBill, setEditBill] = useState(null);

  // Load bills on page load
  useEffect(() => {
    loadBills();
  }, []);

  // Fetch all bills
  const loadBills = () => {
    axios.get(`${Signup_Url}/bill`).then((res) => {
      setBills(res.data);
    });
  };

  // Edit button click
  const handleEdit = (bill) => {
    setEditBill(bill);
    setShowForm(true);
  };

  // Delete bill
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`${Signup_Url}/bill/${id}`).then(() => {
        loadBills();
      });
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">

        {/* LEFT SIDE BUTTON */}
        <div className="col-md-2 text-center">
          <button
            className="btn btn-primary rounded-circle p-3"
            onClick={() => {
              setEditBill(null);
              setShowForm(true);
            }}
          >
            <FaPlus size={22} />
          </button>
          <p className="fw-bold mt-2">New Bill</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-10">

          {/* GENERATE BILL FORM */}
          {showForm && (
            <GenerateBill
              editData={editBill}
              onClose={() => {
                setShowForm(false);
                loadBills();
              }}
            />
          )}

          {/* BILL LIST TABLE */}
          <div className="card shadow mt-3">
            <div className="card-header fw-bold">Bill List</div>

            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Bill Date</th>
                    <th>Pay By</th>
                    <th width="120">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.customerName}</td>
                      <td>{b.billDate}</td>
                      <td>{b.payBy}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(b)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(b.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!bills.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No Bills Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
