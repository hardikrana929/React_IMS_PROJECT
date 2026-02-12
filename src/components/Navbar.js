import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("KeepLogin");
        localStorage.clear();
        navigate('/login');
        closeNavbar();
    };

    const closeNavbar = () => {
        const navbar = document.getElementById("navbarNavAltMarkup");
        if (navbar && navbar.classList.contains("show")) {
            navbar.classList.remove("show");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <Link className="navbar-brand" to="/login" onClick={closeNavbar}>
                <img
                    src="https://cdn-icons-gif.flaticon.com/18999/18999286.gif"
                    width="40"
                    alt="logo"
                />
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav ms-auto">

                    {/* <Link className="nav-link" to="/signup" onClick={closeNavbar}>Signup</Link> */}
                    {/* <Link className="nav-link" to="/addproduct" onClick={closeNavbar}>AddProduct</Link> */}
                    <Link className="nav-link" to="/lowstock" onClick={closeNavbar}>LowStock</Link>
                    <Link className="nav-link" to="/category" onClick={closeNavbar}>AddCategory</Link>
                    <Link className="nav-link" to="/generatebill" onClick={closeNavbar}>Bill</Link>
                    {/* <Link className="nav-link" to="/login" onClick={closeNavbar}><buttonn className="btn-outline-primary"><i class="bi bi-box-arrow-in-left"></i></buttonn></Link> */}
                    <button
                        className="btn btn-outline-danger ms-2"
                        type="button"
                        onClick={logout}
                    >
                        <i className="bi bi-person-walking"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};
