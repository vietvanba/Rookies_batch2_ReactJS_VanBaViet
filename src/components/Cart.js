import React, { useEffect, useState } from "react";
import swal from 'sweetalert';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {
  ListGroup,
  Media,
  Collapse,
  ListGroupItem,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { postWithToken ,getWithToken} from "./ReadAPI";
export default function Cart() {
  const [cart, setcart] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [customer, setcustomer] = useState({})
  let history = useHistory();
  let Total = 0;
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      alert("Please login to add product to cart");
      history.push("/");
    } else {
      if (localStorage.getItem("cart") !== null) {
        setcart(
          JSON.parse(localStorage.getItem("cart")).sort((a, b) => {
            if (
              a.product.product_name.toLowerCase() <
              b.product.product_name.toLowerCase()
            ) {
              return -1;
            }
            if (
              a.product.product_name.toLowerCase() >
              b.product.product_name.toLowerCase()
            ) {
              return 1;
            }
            return 0;
          })
        );
      }
    }
    getWithToken(
        "/customers/" + JSON.parse(localStorage.getItem("user")).user_id,
        localStorage.getItem("token")
      )
        .then((res) => {
            setcustomer(res.data)
            return res.data
        }).then((data)=>{
            document.getElementById("phone").value = data.phone;
            document.getElementById("address").value = data.address;
            let user = JSON.parse(localStorage.getItem("user"));
            document.getElementById("firstname").value = user.first_name;
            document.getElementById("lastname").value = user.last_name;
        })
        .catch((e) => {
          
            console.log(e)
          
        });
    
  }, []);
  function checkCart(id) {
    let check = cart.find((x) => {
      return x.product.product_id === id;
    });
    let cartTemp = cart.filter(
      (x) => x.product.product_id !== check.product.product_id
    );
    check.number = document.getElementById("number" + id).value;
    check.price = check.number * check.product.price;
    cartTemp.push(check);
    cartTemp.sort((a, b) => {
      if (
        a.product.product_name.toLowerCase() <
        b.product.product_name.toLowerCase()
      ) {
        return -1;
      }
      if (
        a.product.product_name.toLowerCase() >
        b.product.product_name.toLowerCase()
      ) {
        return 1;
      }
      return 0;
    });
    localStorage.setItem("cart", JSON.stringify(cartTemp));

    setcart(cartTemp);
    console.log(localStorage.getItem("cart"));
  }
  function handlerValue(e, id,max) {
    if (document.getElementById("number" + id).value < 1) {
      document.getElementById("number" + id).value = 1;
    }
    if (document.getElementById("number" + id).value > max) {
      document.getElementById("number" + id).value = max;
    }
    checkCart(id);
  }
  function plusNumber(id,max) {
    if(document.getElementById("number" + id).value < max){
    document.getElementById("number" + id).value =
      parseInt(document.getElementById("number" + id).value) + 1;}
    checkCart(id);
  }
  function subNumber(id) {
    if (document.getElementById("number" + id).value > 1) {
      document.getElementById("number" + id).value =
        parseInt(document.getElementById("number" + id).value) - 1;
    }
    checkCart(id);
  }
  function handlerOrder() {
    if (collapse === true) {
      postWithToken(
        "/orders?userName=" +
          JSON.parse(localStorage.getItem("user")).user_name,
        {first_name:document.getElementById('firstname').value,
        last_name:document.getElementById('lastname').value,
        phone:document.getElementById('phone').value,
        address:document.getElementById('address').value,
        order_details:cart
        },
        localStorage.getItem("token")
      ).then((res)=>{
          if(res.status===200)
          {
              localStorage.removeItem("cart");
              setcart([]);
            swal("Success!", "Order successed!", "success");
          }
      }).catch(e=>{
        NotificationManager.error(e.response.data.message,"Order Fail")
      });
    } else {
      toggle();
    }
  }
  function handlerDelete(id) {
    let temp = cart.filter((x) => x.product.product_id !== id);
    temp.sort((a, b) => {
      if (
        a.product.product_name.toLowerCase() <
        b.product.product_name.toLowerCase()
      ) {
        return -1;
      }
      if (
        a.product.product_name.toLowerCase() >
        b.product.product_name.toLowerCase()
      ) {
        return 1;
      }
      return 0;
    });
    localStorage.setItem("cart", JSON.stringify(temp));
    setcart(temp);
    NotificationManager.error('Order', 'Deleted!');
  }
  const toggle = () => setCollapse(!collapse);
  return (
    <div>
      <Row className="mt-5">
        <Col md={1}></Col>
        <Col md={10}>
          <h3 style={{ textAlign: "left" }}>Cart</h3>
          <div id="listcart"></div>
          {cart.length === 0 ? (
            <div>
              <h4>You have not added any products yet </h4>
            </div>
          ) : (
            <div>
              {cart.map((x) => {
                Total += x.price;
                return (
                  <ListGroupItem action>
                    <Row>
                      <Col md={1}>
                        <Media
                          style={{ height: "50px" }}
                          src={x.product.imageDTOS[0].url}
                        ></Media>
                      </Col>
                      <Col md={3}>
                        <Link to={"/products/" + x.product.product_id}>
                          {x.product.product_name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        Quantity:{" "}
                        <button
                          onClick={() => {
                            subNumber(x.product.product_id);
                          }}
                        >
                          -
                        </button>
                        <input
                          id={"number" + x.product.product_id}
                          defaultValue={x.number<=x.product.number? x.number:x.product.number}
                          min="1"
                          style={{ width: "15%" }}
                          type="number"
                          max={x.product.number}
                          onChange={(e) => {
                            handlerValue(e, x.product.product_id,x.product.number);
                          }}
                          
                        />
                        <button
                          onClick={() => {
                            plusNumber(x.product.product_id,x.product.number);
                          }}
                        >
                          +
                        </button>
                      </Col>
                      <Col md={3} style={{ textAlign: "left" }}>
                        Price: {x.number * x.product.price}
                      </Col>
                      <Col md={1}>
                        <Button
                          className="btn btn-danger"
                          onClick={() => {
                            handlerDelete(x.product.product_id);
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                );
              })}
              <ListGroupItem action>
                <Row>
                  <Col md={8}></Col>
                  <Col md={3} style={{ textAlign: "left" }}>
                    Total: {Total}{" "}
                  </Col>
                </Row>
              </ListGroupItem>
            </div>
          )}
        </Col>
        <Col md={1}></Col>
      </Row>
      {cart.length === 0 ? (
        <div></div>
      ) : (
        <Collapse isOpen={collapse}>
          <div className="UserInfo">
            <FormGroup className="mt-3">
              <Label for="firstname">First name</Label>
              <Input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="First name"
              />
            </FormGroup>
            <FormGroup className="mt-3">
              <Label for="lastname">Last name</Label>
              <Input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Last name"
              />
            </FormGroup>
            <Form className="mt-3">
              <FormGroup className="mt-3">
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="1234 Main St, District,City, VN"
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label for="phone">Phone number</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="0001112222"
                />
              </FormGroup>
            </Form>
          </div>
        </Collapse>
      )}
      {cart.length === 0 ? (
        <div></div>
      ) : (
        <Button
          className="btn btn-success mt-3"
          onClick={() => {
            handlerOrder();
          }}
        >
          Order now
        </Button>
      )}
      <NotificationContainer/>
    </div>
  );
}
