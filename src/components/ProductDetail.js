import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactDOM from "react-dom";
import { get, postWithToken, post, del } from "./ReadAPI";
import Comment from '../components/Comment'
import { Row, Col } from "reactstrap";
import CarouselDetail from "./CarouselDetail";
import "../css/ProductDetail.css";
import "../css/rate.scss"
export default function ProductDetail() {
  const { productsID } = useParams();
  const [product, setproduct] = useState({});
  let history = useHistory();
  let cart = [];
  useEffect(() => {
    get("/products/" + productsID)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setproduct(data);
        return data;
      })
      .then((data) => {
        ReactDOM.render(
          <CarouselDetail items={data.imageDTOS} />,
          document.getElementById("carousel")
        );
      })
      .catch((error) => {console.log(error);history.push('/')});
  }, [productsID]);
  function formatCash(str) {
    if (str !== undefined) {
      return str
        .toString()
        .split("")
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 3 ? next : next + ",") + prev;
        });
    } else {
      return "";
    }
  }
  function addToCart(product, number) {
    if (localStorage.getItem("token") === null) {
      alert("Please login to add product to cart");
    } else {
      if (localStorage.getItem("cart") !== null) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //
      let check = cart.find((x) => {
        return x.product.product_id === product.product_id;
      });
      if (check === undefined) {
        cart.push({
          product: product,
          number: parseInt(number),
          price: product.price,
        });
      } else {
        cart = cart.filter(
          (x) => x.product.product_id !== check.product.product_id
        );
        check.number = parseInt(check.number) + parseInt(number);
        check.price = check.number * check.product.price;
        cart.push(check);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(localStorage.getItem("cart"));
      NotificationManager.success('Add to cart success', 'Success');
    }
  }
  function handlerValue(e,max) {
    if (document.getElementById("number").value < 1) {
      document.getElementById("number").value = 1;
    }
    if (document.getElementById("number").value > max) {
      document.getElementById("number").value = max;
    }
  }
  function plusNumber(max) {
    if(document.getElementById("number").value<max)
    {
      document.getElementById("number").value =
      parseInt(document.getElementById("number").value) + 1;
    }
  }
  function subNumber() {
    if (document.getElementById("number").value > 1) {
      document.getElementById("number").value =
        parseInt(document.getElementById("number").value) - 1;
    }
  }
  return (
    <div>
      
      <div class="container">
        
        <div class="card">
          
          <div class="container-fliud">
            <div class="wrapper row">
              
              <div class="preview col-md-6">
                
                <div id="carousel"></div>
              </div>
              <div class="details col-md-6" style={{ textAlign: "left" }}>
                <h3 class="product-title">Name: {product.product_name}</h3>
                <div class="star-rating" title={product.rate*20+'%'}>
    <div class="back-stars">
        <i class="fa fa-star" aria-hidden="true"></i>
        <i class="fa fa-star" aria-hidden="true"></i>
        <i class="fa fa-star" aria-hidden="true"></i>
        <i class="fa fa-star" aria-hidden="true"></i>
        <i class="fa fa-star" aria-hidden="true"></i>
        
        <div class="front-stars" style={{width:product.rate*20+'%'}}>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
            <i class="fa fa-star" aria-hidden="true"></i>
        </div>
    </div>
</div> 
                <p class="small-text">{product.number_rate} reviews</p>
                <p class="product-description">
                  <Row>
                    <p>Description: {product.description}</p>
                  </Row>
                </p>
                <h4 class="price">
                  Price: <span>{formatCash(product.price)} VNĐ </span>
                </h4>
                <h4>
                  Number:{" "}
                  <button
                    onClick={() => {
                      subNumber();
                    }}
                  >
                    -
                  </button>
                  <input
                    id="number"
                    defaultValue="1"
                    min="1"
                    style={{ width: "15%" }}
                    type="number"
                    onChange={(e) => {
                      handlerValue(e,product.number);
                    }}
                  />
                  <button
                    onClick={() => {
                      plusNumber(product.number);
                    }}
                  >
                    +
                  </button>
                </h4>
                {product.number===0? <div style={{color:"red"}}>Out of stock</div>:<div class="action mt-3">
                  <Row>
                    <Col md={4}>
                      <button
                        class="btn btn-warning"
                        type="button"
                        onClick={() => {
                          addToCart(
                            product,
                            document.getElementById("number").value
                          );
                        }}
                      >
                        ADD TO CART
                      </button>
                    </Col>
                    <Col md={4}>
                      <button
                        class="btn btn-success"
                        type="button"
                        onClick={() => {
                          addToCart(
                            product,
                            document.getElementById("number").value
                          );
                          if (localStorage.getItem("token") !== null)
                            history.push("/cart");
                        }}
                      >
                        BUY NOW
                      </button>
                    </Col>
                  </Row>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Comment idProduct={productsID}/>
      <NotificationContainer/>
    </div>
  );
}
