import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import logo from "../img/logoBookStore.png";
import "../css/NavBar.css";
import {
  Dropdown,
  DropdownItem,
  Nav,
  DropdownToggle,
  NavItem,
  NavLink,
  DropdownMenu,
  Media,
  Input,
  Button,
  InputGroupAddon,
  InputGroup,
  Row,
  Col,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Form,
  Badge,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faSignInAlt,
  faSignOutAlt,
  faUserAlt,
  faList
} from "@fortawesome/free-solid-svg-icons";


import { get, getWithToken, post } from "./ReadAPI";
const imgStyle = {
  maxHeight: 50,
  maxWidth: 250,
};

function NavBar(params) {
  let history = useHistory();
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [onMouse, setMouse] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalSignUp, setmodalSignUp] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [listCategories, setListCategories] = useState([]);
  const [listResult, setListResult] = useState([]);
  const [number, setnumber] = useState()
  useEffect(() => {
    get("/categories")
      .then((response) => {
        setListCategories(response.data);
      })
      .catch((error) => console.log(error));
    localStorage.getItem("role") === "ROLE_ADMIN"
      ? history.push("/admin")
      : history.push("#")
  },[]);
  function handleNull(classname) {
    var x = document.getElementsByClassName(classname);
    var check = true
    var i;
    for (i = 0; i < x.length; i++) {
      if(x[i].value==='')
      {
        NotificationManager.error(x[i].name+" must be not blank", x[i].name);
        check= false
      }
    }
    return check
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    if(handleNull("formLogin")!==false)
    {
    

    post("/auth/signin", {
      username: e.target.username.value,
      password: e.target.password.value,
    })
      .then(async (res) => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("role", res.data.roles[0]);
        
        await getWithToken("/users/" + res.data.id, res.data.accessToken).then(
          (response) => {
            localStorage.setItem('user',JSON.stringify(response.data))
            localStorage.setItem(
              "fullName",
              response.data.first_name + " " + response.data.last_name
            );
          }
        );
        
        localStorage.getItem("role") === "ROLE_ADMIN"
          ? history.push("/admin")
          : 
        setModalLogin(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.status === 401)
          alert("Vui lòng kiểm tra lại Username và Password!");
        else console.log(error.response.data);
      });
    }
  }
  function clickLogin() {
    document.getElementById("spinner").innerHTML =
      '<div class="spinner-border spinner-border-sm" role="status"></div>';
  }
  
  function handlerSearch(e) {
    get("/products/search/" + e.target.value)
      .then((res) => {
        setListResult(res.data);
        ReactDOM.render(
          listResult.map((x) => {
            return (
              <div>
                <div key={x.product_id} style={{ width: "23.5rem"}}>
                  <a href={"/products/" + x.product_id}>
                    <Alert color="primary" className="resultSearch">
                      {x.product_name}
                    </Alert>
                  </a>
                </div>
              </div>
            );
          }),
          document.getElementById("result")
        );
      })
      .catch((err) => {
        ReactDOM.render("", document.getElementById("result"));
      });
    setSearchKey(e.target.value);
  }
  function updateCart() {
    setInterval(() => {
      let temp=localStorage.getItem('cart');
      if(temp!==null)
      {
        setnumber(JSON.parse(temp).length)
      }else{
        setnumber(0)
      }
    }, 1000);
    return(number)
  }
  function handleSignUpFormSubmit(e) {
    if(handleNull("formSignUp")!==false){
    e.preventDefault();
    console.log(e.target.username.value);
    console.log(e.target.password.value);
    console.log(e.target.firstName.value);
    console.log(e.target.lastName.value);
    console.log(e.target.email.value);
    if (e.target.password.value === e.target.confirm.value) {
      document.getElementById("errorMessage").innerHTML = "";
      post("/auth/signup", {
        username: e.target.username.value,
        password: e.target.password.value,
        first_name: e.target.firstName.value,
        last_name: e.target.lastName.value,
        email: e.target.email.value,
      })
        .then((res) => {
          console.log(res);
          setModalLogin(false);
          if (res.status === 200) {
            alert("Account successfully created");
          }
        })
        .catch((error) => {
          alert(error.response.data);
          console.log(error.response.data)
        });
    } else {
      document.getElementById("errorMessage").style.color = "red";
      document.getElementById("errorMessage").innerHTML =
        "Password not matching";
    }
  }}

  return (
    <div className="Navbar">
      <div className="container-fluid">
        <Row>
          <Nav
            style={{
              paddingTop: "0rem",
              paddingBottom: "0rem",
              alignItems: "center",
            }}
          >
            <Col md={2}>
              <NavItem>
                <Link to="/">
                  <Media
                    src={logo}
                    alt="Logo Book Store"
                    style={imgStyle}
                  ></Media>
                </Link>
              </NavItem>
            </Col>
            <Col md={1}>
              <Dropdown
                nav
                isOpen={dropdownOpen}
                toggle={() => {
                  setDropDownOpen(!dropdownOpen);
                }}
              >
                <DropdownToggle nav caret className="colorWhite">
                  Categories
                </DropdownToggle>
                <DropdownMenu>
                  {listCategories.map((x) => {
                    return (
                      <div>
                        <DropdownItem style={{textAlign:'center',margin:'0rem',padding:'0rem'}} key={x.product_categories_id} onClick={()=>{history.push("/categories/"+x.product_categories_id)}}>{x.name}</DropdownItem>
                      </div>
                    );
                  })}
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md={1}>
              <NavItem>
                <NavLink className="colorWhite" href="#">
                  Link
                </NavLink>
              </NavItem>
            </Col>
            <Col md={1}>
              <NavItem>
                <NavLink className="colorWhite" href="/about">
                  About
                </NavLink>
              </NavItem>
            </Col>
            <Col md={2}></Col>
            <Col md={3}>
              <Row>
                <InputGroup size="40px">
                  <Input
                    id="idsearch"
                    placeholder="Search"
                    onChange={(e) => {
                      handlerSearch(e);
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Link
                      className="btn btn-primary"
                      to={"/search/" + searchKey}
                    >
                      Search!
                    </Link>
                  </InputGroupAddon>
                </InputGroup>
              </Row>
              <div
                id="result"
                style={{ position: "absolute", opacity: "1.0" }}
              ></div>
            </Col>
            <Col md={1}>
              {localStorage.getItem("token") != null ? (
                <NavItem>
                  <Dropdown
                    nav
                    onMouseEnter={() => {
                      setMouse(!onMouse);
                    }}
                    onMouseLeave={() => {
                      setMouse(!onMouse);
                    }}
                    isOpen={onMouse}
                  >
                    <DropdownToggle nav caret className="colorWhite">
                      <FontAwesomeIcon icon={faUserAlt} />
                      {localStorage.getItem("fullName")}
                    </DropdownToggle>
                    <DropdownMenu>
                    <DropdownItem>
                        <NavLink
                          href="/user"
                          className="btn"
                          style={{ color: "#30BCED" }}
                        >
                          <FontAwesomeIcon icon={faUserAlt} /> Profile
                        </NavLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NavLink
                          href="/orders"
                          className="btn"
                          style={{ color: "#30BCED" }}
                        >
                          <FontAwesomeIcon icon={faList} /> Order
                        </NavLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NavLink
                          href="/"
                          onClick={() => {
                            localStorage.removeItem("fullName");
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("user");
                          }}
                          className="btn"
                          style={{ color: "#30BCED" }}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} /> Log out
                        </NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavItem>
              ) : (
                <NavItem>
                  <NavLink
                    href="#"
                    onClick={() => {
                      setModalLogin(true);
                    }}
                    className="btn colorWhite"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                  </NavLink>
                </NavItem>
              )}
            </Col>
            <Col md={1}>
              {localStorage.getItem("token") != null ? (
                <NavItem>
                  <NavLink className="colorWhite" href="/cart">
                    <FontAwesomeIcon icon={faCartPlus} /> Cart{" "}
                    <Badge style={{ background: "#ff6663" }} pill>
                      {updateCart()}
                    </Badge>
                  </NavLink>
                </NavItem>
              ) : (
                <NavItem>
                  <NavLink
                    href="#"
                    onClick={() => {
                      setmodalSignUp(true);
                    }}
                    className="btn colorWhite"
                  >
                    <FontAwesomeIcon icon={faUserAlt} /> Sign Up
                  </NavLink>
                </NavItem>
              )}
            </Col>
          </Nav>
        </Row>
      </div>
      <Modal isOpen={modalLogin}>
        <ModalHeader
          toggle={() => {
            setModalLogin(false);
          }}
        >
          Login
        </ModalHeader>
        <Form onSubmit={(e) => handleFormSubmit(e)}>
          <ModalBody>
            <FormGroup row className="mb-3">
              <Label for="username" sm={2}>
                Username
              </Label>
              <Col sm={10}>
                <Input className="formLogin"
                  type="text"
                  name="user"
                  id="username"
                  placeholder="Username"
                  minLength='5'
                  maxLength='50'
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="password" sm={2}>
                Password
              </Label>
              <Col sm={10}>
                <Input className="formLogin"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  minLength='6'
                  maxLength='50'
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <div id="spinner"></div>
            <Button
              color="primary"
              onClick={() => {
                clickLogin();
              }}
              type="submit"
            >
              Login
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setModalLogin(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <Modal isOpen={modalSignUp}>
        <ModalHeader
          toggle={() => {
            setmodalSignUp(false);
          }}
        >
          Sign up
        </ModalHeader>
        <Form onSubmit={(e) => handleSignUpFormSubmit(e)}>
          <ModalBody>
            <FormGroup row className="mb-3" >
              <Label for="username" sm={3}>
                Username
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="text"
                  name="user"
                  id="username"
                  placeholder="Username"
                  minLength='5'
                  maxLength='50'
                  required
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-3">
              <Label for="password" sm={3}>
                Password
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  minLength='6'
                  maxLength='50'
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="confirm" sm={3}>
                Confirm
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="password"
                  name="confirm"
                  id="confirm"
                  placeholder="Confirm"
                  minLength='6'
                  maxLength='50'
                  required
                />
                <span id="errorMessage"></span>
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="email" sm={3}>
                Email
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  minLength='1'
                  maxLength='50'
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="firstName" sm={3}>
                First name
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First name"
                  minLength='1'
                  maxLength='50'
                  required
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="lastName" sm={3}>
                Last name
              </Label>
              <Col sm={9}>
                <Input className="formSignup"
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last name"
                  minLength='1'
                  maxLength='50'
                  required
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Sign up
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setmodalSignUp(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal><NotificationContainer/>
    </div>
  );
}

export default NavBar;
