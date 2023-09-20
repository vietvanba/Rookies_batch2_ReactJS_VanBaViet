import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, postWithToken, post, del } from "../ReadAPI";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import swal from "sweetalert";
import {
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Media,
  Label,
  Button,
  FormGroup,
  Form,
  Input,
  FormText,
  InputGroupButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import classnames from "classnames";
import "./assets/Product.css";

export default function Catrgories() {
  const [activeTab, setActiveTab] = useState("1");
  const [listCategories, setListCategories] = useState([]);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
    if (tab === "1") {
      get("/categories")
        .then((response) => {
          setListCategories(response.data);
        })
        .catch((error) => console.log(error));
    }
  };
  useEffect(() => {
    get("/categories")
      .then((response) => {
        setListCategories(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
  function handlerDel(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this categories!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        del("/categories?id=" + id, localStorage.getItem("token"))
          .then((res) => {
            setListCategories(
              listCategories.filter((item) => item.product_categories_id !== id)
            );
            return res.data;
          })
          .then((data) => {
            swal(data, {
              icon: "success",
            });
          })
          .catch((err) => {
            alert(err.response.data.message);
            console.log(err.response);
          });
      } else {
        swal("Your product is safe!");
      }
    });
  }

  async function handlerSubmitForm() {
    if(handleNull()!==false){
    document.getElementById("btnSave").innerHTML =
      '<div class="spinner-border spinner-border-sm"></div>';
    await postWithToken(
      "/categories",
      {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
      },
      localStorage.getItem("token")
    )
      .then((res) => {
        if (res.status === 200) {
          document.getElementById("btnSave").innerHTML = "Save";
          swal("Success!", "Categories has been created!", "success");
          document.getElementById("name").value = "";
          document.getElementById("description").value = "";
        }
        console.log(res);
      })
      .catch((err) => {
        document.getElementById("btnSave").innerHTML = "Save";
      });
    }
  }
  function handleNull() {
    var x = document.getElementsByClassName("formvalue");
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
  return (
    <div className="form">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            List Categories
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Add Categories
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <ListGroup>
                {listCategories.map((x) => {
                  return (
                    <ListGroupItem
                      className="listItem"
                      key={x.product_categories_id}
                    >
                      <Row>
                        <Col md={9}>
                          <Label
                            className="productName"
                            style={{ marginLeft: "3rem" }}
                          >
                            {x.name}
                          </Label>
                        </Col>
                        <Col style={{ marginTop: ".4rem" }} md={1}>
                          <Link
                            to={
                              "/admin/categories/edit/" +
                              x.product_categories_id
                            }
                            className="btn btn-warning"
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col style={{ marginTop: ".4rem" }} md={1}>
                          <Button
                            onClick={() => {
                              handlerDel(x.product_categories_id);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Form className="form">
              <Row>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input className="formvalue" type="text" name="name" id="name" minLength='1'
                  maxLength='50'
                  required></Input>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input className="formvalue" type="textarea" name="description" id="description" minLength='1'
                  maxLength='255'
                  required/>
                </FormGroup>
              </Row>
            </Form>
            <Row>
              <Col md={1}></Col>
              <Col md={10}>
                <Label
                  style={{ width: "100%", textAlign: "center" }}
                  className="buttonSubmit btn btn-success"
                  onClick={() => {
                    handlerSubmitForm();
                  }}
                >
                  <div id="btnSave">Save</div>
                </Label>
              </Col>
              <Col md={1}></Col>
            </Row>
          </Row>
        </TabPane>
      </TabContent>
      <NotificationContainer/>
    </div>
  );
}
