import React, { useState,useEffect } from "react";
import { Col, Input, Media, Row } from "reactstrap";
import "./assets/bootstrap/css/bootstrap.min.css";
import "./assets/fonts/fontawesome-all.min.css";
import "./assets/fonts/font-awesome.min.css";
import "./assets/fonts/fontawesome5-overrides.min.css";

import {
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  Collapse,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
export default function NavBarAdmin() {
  let history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    localStorage.getItem("role") !== "ROLE_ADMIN"
      ? history.push("/")
      : history.push("#")
  }, [])
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div >
      <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
        <div class="container-fluid d-flex flex-column p-0">
          <a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
            href="/admin/"
          >
            <div class="sidebar-brand-icon rotate-n-15">
              <i class="fas fa-laugh-wink"></i>
            </div>
            <div class="sidebar-brand-text mx-3">
              <span>Brand</span>
            </div>
          </a>
          <hr class="sidebar-divider my-0" />
          <ul class="navbar-nav text-light" id="accordionSidebar">
            <li class="nav-item">
              <a class="nav-link " href="/admin/orders">
                <i class="fa fa-shopping-cart"></i>
                <span>Order</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/admin/products">
                <i class="fab fa-product-hunt"></i>
                <span>Products</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/admin/categories">
                <i class="far fa-list-alt"></i>
                <span>Categories</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/admin/users">
                <i class="fa fa-user"></i>
                <span>User</span>
              </a>
            </li>
            <li class="nav-item" >
              <a class="nav-link" href="/" onClick={() => {
                            localStorage.removeItem("fullName");
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("user");
                          }}>
                <i class="fas fa-sign-out-alt"></i>
                <span>Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      </div>
      );
}
