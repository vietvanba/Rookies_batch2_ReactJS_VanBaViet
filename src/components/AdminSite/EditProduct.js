import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, patchWithToken } from "../ReadAPI";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import swal from "sweetalert";
import {
  Row,
  Col,
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
export default function EditProduct() {
  let file = "";
  const { productID } = useParams();
  const [splitButtonOpen, setSplitButtonOpen] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [categoriesChoose, setCategoriesChoose] = useState({});
  const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);
  function chosseCategories(categories) {
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
  async function getImage(fileName) {
    let images = [];
    await fileName.forEach((element) => {
      getBase64(element).then((data) => {
        images.push({ url: data, description: element.name });
      });
    });
    return images;
  }
  async function postProducts() {
    let check = true;
    listImage.map((x) => {
      let str = x.url.substr(0, 10);
      if (str !== "data:image") {
        check = false;
      }
    });
    if (check === true) {
      patchWithToken(
        "/products?id=" + productID,
        {
          product_name: document.getElementById("productName").value,
          product_categories: categoriesChoose,
          description: document.getElementById("description").value,
          number: document.getElementById("number").value,
          price: document.getElementById("price").value,

          images: listImage,
        },
        localStorage.getItem("token")
      )
        .then((res) => {
          if (res.status === 200) {
            document.getElementById("btnSave").innerHTML = "Save";
            swal("Success!", "Product has been edited!", "success");
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
    }else
    {
      document.getElementById("file").value=""
      swal("Error!","File not supported","error")
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
  useEffect(() => {
    get("/products/" + productID)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        document.getElementById("productName").value = data.product_name;
        document.getElementById("description").value = data.description;
        document.getElementById("number").value = data.number;
        document.getElementById("price").value = data.price;
        document.getElementById("nameCategories").innerHTML =
          data.product_categories.name;
        setCategoriesChoose(data.product_categories);
        // document.getElementById("file").value = data.;
      })
      .catch((error) => console.log(error));
    get("/categories")
      .then((response) => {
        setListCategories(response.data);
      })
      .catch((error) => console.log(error));
  }, [
    document.getElementById("nameCategories"),
    document.getElementById("price"),
    document.getElementById("productName"),
    document.getElementById("description"),
    document.getElementById("number"),
  ]);
  return (
    <div>
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
                              chosseCategories(x);
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
            />
          </FormGroup>
        </Form>
        <Label
          className="buttonSubmit btn btn-success"
          onClick={() => {
            handlerSubmitForm().then((res) => {
              if (res === true) {
                postProducts();
              }
            });
          }}
        >
          <div id="btnSave">Save</div>
        </Label>
      </Row>
      <NotificationContainer />
    </div>
  );
}
