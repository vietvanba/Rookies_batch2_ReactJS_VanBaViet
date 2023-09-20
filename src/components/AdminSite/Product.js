import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, postWithToken, del } from "../ReadAPI";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
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
  InputGroupButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import classnames from "classnames";
import "./assets/Product.css";

export default function Product() {
  let file = "";
  const [activeTab, setActiveTab] = useState("1");
  const [splitButtonOpen, setSplitButtonOpen] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [listImage, setListImage] = useState([]);

  const [categoriesChoose, setCategoriesChoose] = useState({});
  const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
    if (tab === "1") {
      get("/products")
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          setListProduct(data);
        })
        .catch((error) => console.log(error));
    }
  };
  useEffect(() => {
    get("/products")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setListProduct(data);
      })
      .catch((error) => console.log(error));
    get("/categories")
      .then((response) => {
        setListCategories(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
  function handleNull() {
    var x = document.getElementsByClassName("formvalue");
    var check = true;
    var i;
    for (i = 0; i < x.length; i++) {
      if (x[i].value === "") {
        NotificationManager.error(x[i].name + " must be not blank", x[i].name);
        check = false;
      }
    }
    if (categoriesChoose === null || categoriesChoose === undefined) {
      NotificationManager.error(" Categories must be not blank", "Categories");
      check = false;
    }
    return check;
  }
  function handlerDel(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        del("/products?id=" + id, localStorage.getItem("token"))
          .then((res) => {
            setListProduct(
              listProduct.filter((item) => item.product_id !== id)
            );
            return res.data;
          })
          .then((data) => {
            swal(data, {
              icon: "success",
            });
          })
          .catch((err) => {
            swal("Error!", err.response.data.message, "error");
          });
      } else {
        swal("Your product is safe!");
      }
    });
  }
  function chooseCategories(categories) {
    setCategoriesChoose(categories);
    document.getElementById("nameCategories").innerHTML = categories.name;
  }
  function getBase64(imgFile) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject("Error: ", error);
      };
    });
  }
  function handleChangeFile(event) {
    getImage(Array.from(event.target.files)).then((res) => {
      setListImage(res);
    });
  }
  async function getImage(fileName) {
    let images = [];

    await fileName.forEach((element) => {
      getBase64(element).then((data) => {
        images.push({ url: data, description: element.name });
      });
    });
    return images;
  }
  function postProducts() {
    let check = true;
    listImage.map((x) => {
      let str = x.url.substr(0, 10);
      if (str !== "data:image") {
        check = false;
      }
    });
    if (check === true) {
      postWithToken(
        "/products?categoryID=" + categoriesChoose.product_categories_id,
        {
          product_name: document.getElementById("productName").value,
          product_categories: categoriesChoose,
          description: document.getElementById("description").value,
          number: document.getElementById("number").value,
          price: document.getElementById("price").value,
          rate: 0,
          number_rate: 0,
          created_date: new Intl.DateTimeFormat("fr-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(Date.now()),
          updated_date: new Intl.DateTimeFormat("fr-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(Date.now()),
          images: listImage,
        },
        localStorage.getItem("token")
      )
        .then((res) => {
          if (res.status === 200) {
            document.getElementById("btnSave").innerHTML = "Save";
            swal("Success!", "Product has been created!", "success");
            document.getElementById("productName").value = "";
            document.getElementById("description").value = "";
            document.getElementById("number").value = "";
            document.getElementById("price").value = "";
            document.getElementById("nameCategories").innerHTML = "Categories";
            document.getElementById("file").value = "";
          }
          console.log(res);
        })
        .catch((err) => {
          document.getElementById("btnSave").innerHTML = "Save";
        });
    } else {
      document.getElementById("file").value = "";
      swal("Error!", "File not supported", "error");
    }
  }
  async function handlerSubmitForm() {
    if (handleNull() !== false) {
      if (listImage !== undefined) {
        document.getElementById("btnSave").innerHTML =
          '<div class="spinner-border spinner-border-sm"></div>';
      } else {
        alert("Please choose files");
      }
      return true;
    }
    return false;
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
            List Products
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Add Products
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <ListGroup>
                {listProduct.map((x) => {
                  if (x.imageDTOS[0] === undefined) {
                    return <div />;
                  }
                  return (
                    <ListGroupItem className="listItem" key={x.product_id}>
                      <Row>
                        <Col md={2}>
                          <Media
                            src={x.imageDTOS[0].url}
                            alt={x.imageDTOS[0].url}
                            className="imageProduct"
                          ></Media>
                        </Col>
                        <Col md={8}>
                          <Label className="productName">
                            {x.product_name}
                          </Label>
                        </Col>
                        <Col style={{ marginTop: ".4rem" }} md={1}>
                          <Link
                            to={"/admin/products/edit/" + x.product_id}
                            className="btn btn-warning"
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col style={{ marginTop: ".4rem" }} md={1}>
                          <Button
                            onClick={() => {
                              handlerDel(x.product_id);
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
              <Row className="item">
                <Col md={6}>
                  <FormGroup>
                    <Label for="productName">Name</Label>
                    <Input
                      type="text"
                      name="productName"
                      id="productName"
                      placeholder="Product name"
                      className="formvalue"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <Label for="categories">Categories</Label>
                  <FormGroup>
                    <InputGroupButtonDropdown
                      addonType="prepend"
                      isOpen={splitButtonOpen}
                      toggle={toggleSplit}
                      id="categories"
                    >
                      <Button outline id="nameCategories" onClick={() => {}}>
                        Categories
                      </Button>
                      <DropdownToggle split outline />
                      <DropdownMenu>
                        {listCategories.map((x) => {
                          return (
                            <div>
                              <DropdownItem
                                key={x.product_categories_id}
                                onClick={() => {
                                  chooseCategories(x);
                                }}
                              >
                                {x.name}
                              </DropdownItem>
                            </div>
                          );
                        })}
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <FormGroup>
                  <Label for="number">Number (Quantity)</Label>
                  <Input
                    type="number"
                    name="number"
                    id="number"
                    className="formvalue"
                  ></Input>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    className="formvalue"
                  ></Input>
                </FormGroup>
              </Row>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  className="formvalue"
                />
              </FormGroup>
              <FormGroup className="listFile">
                <Label for="file">Images</Label>

                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleChangeFile}
                  ref={(input) => {
                    file = input;
                  }}
                  multiple
                  className="formvalue"
                />
              </FormGroup>
            </Form>
            <Label
              className="buttonSubmit btn btn-success"
              onClick={() => {
                handlerSubmitForm().then((x) => {
                  if (x === true) {
                    postProducts();
                  }
                });
              }}
            >
              <div id="btnSave">Save</div>
            </Label>
          </Row>
        </TabPane>
      </TabContent>
      <NotificationContainer />
    </div>
  );
}
