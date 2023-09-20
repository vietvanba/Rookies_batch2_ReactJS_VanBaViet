import React, { useEffect, useState,useRef } from "react";
import { Link,useParams,useHistory } from "react-router-dom";
import { get, postWithToken, post, del } from "./ReadAPI";
import {NotificationContainer, NotificationManager} from 'react-notifications';
export default function CategoriesUser() {
    const [listProduct, setListProduct] = useState([]);
    let cart=[];
    let history = useHistory();
    const {categoriesID}=useParams();
    useEffect(() => {
        get("/products/categories?categoriesID="+categoriesID)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
           
            setListProduct(data);
          })
          .catch((error) => console.log(error));
        
      }, [categoriesID]);
    function formatCash(str) {
        return str
          .split("")
          .reverse()
          .reduce((prev, next, index) => {
            return (index % 3 ? next : next + ",") + prev;
          });
      }
      function addToCart(product) {
        if (localStorage.getItem("token") === null) {
          alert("Please login to add product to cart");
        } else {
    
          if(localStorage.getItem('cart')!==null)
          {
           cart = JSON.parse(localStorage.getItem('cart'))
          }
          //
          let check=cart.find((x)=>{return x.product.product_id===product.product_id});
          if(check===undefined)
          {
            cart.push({
              product:product,
              number:1,
              price:product.price
            });
          }else
          {
            cart=cart.filter((x)=>x.product.product_id!==check.product.product_id);
            check.number++;
            check.price=check.number*check.product.price;
            cart.push(check)
          }
           localStorage.setItem("cart",JSON.stringify(cart));
           console.log(localStorage.getItem("cart"))
           NotificationManager.success('Add to cart success', 'Success');
        }
        
      }
    return (
        <div>
            <div class="Home">
        <div class="row product-list">
          {listProduct.map((x) => {
            return (
              <div class={"col-sm-6 col-md-4 product-item"} key={x.product_id}>
                <div class="product-container">
                  <div class="row">
                    <div class="col-md-12">
                      <Link
                        class="product-image"
                        to={"/products/" + x.product_id}
                      >
                        <img src={x.imageDTOS[0].url} />
                      </Link>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8">
                      <h2>
                        <Link to={"/products/" + x.product_id}>
                          {x.product_name}
                        </Link>
                      </h2>
                    </div>
                    <div class="col-4">
                      <Link
                        class="small-text"
                        to={
                          "/categories/" +
                          x.product_categories.product_categories_id
                        }
                      >
                        {x.product_categories.name}
                      </Link>
                    </div>
                  </div>
                  <div class="product-rating">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star-half"></i>
                    <p class="small-text">82 reviews</p>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <p class="product-description">{x.description} </p>
                      <div class="row">
                        {x.number===0? <div style={{color:"red"}}>Out of stock</div>:<div class="col-6">
                          <button class="btn btn-light" type="button" onClick={()=>{addToCart(x)
                            history.push("/cart")
                            }}>
                            Buy Now!
                          </button>
                          <button
                            class="btn btn-light mt-3 button"
                            type="button"
                            onClick={() => {
                              addToCart(x);
                              
                            }}
                          >
                            Add to cart!
                          </button>
                        </div>}
                        <div class="col-6">
                          <p class="product-price">
                            {formatCash(x.price.toString())} VNĐ{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <NotificationContainer/>
        </div>
    )
}
