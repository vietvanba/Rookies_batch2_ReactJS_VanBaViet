import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../css/Order.css";
import {NotificationContainer, NotificationManager} from 'react-notifications';

import { getWithToken, patchWithToken } from "./ReadAPI";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  ListGroupItem,
  Col,
  Row,
  Media,
} from "reactstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const Order = (props) => {
  const [order, setOrder] = useState([]);
  const [list, setList] = useState([]);
  const listStatus = [
    "CONFIRMED",
    "IN_TRANSIT",
    "DELIVERY_ORDER",
    "FINISHED",
    "CANCEL",
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  useEffect(() => {
    getWithToken(
      "/orders/user_id?id=" + JSON.parse(localStorage.getItem("user")).user_id,
      localStorage.getItem("token")
    ).then((res) => {
      setOrder(res.data);
      setList(res.data.filter((x) => x.status === "CONFIRMED"));
      document.getElementById("filterName").innerHTML = "CONFIRMED";
    });
  }, []);
  function filter(key) {
    document.getElementById("filterName").innerHTML = key;
    setList(order.filter((x) => x.status === key));
  }
  const products = list.map((p) => {
    var localDate = new Date(p.order_time);
    var fistime = "Unfinished";
    if (p.finish_time !== null) {
      fistime = new Date(p.finish_time).toLocaleString();
    }
    return {
      id: p.order_id,
      time: localDate.toLocaleString(),
      finishedtime: fistime,
      total: formatCash(p.total_price) + " VNĐ",
      status: p.status,
      data: p,
    };
  });
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
  function handleCancel(id) {
    patchWithToken("/orders/cancel?id=" + id, {}, localStorage.getItem("token"))
      .then((res) => {
        if (res.status === 200) {
          swal("Success!", "Cancel order success!", "success");
          let check = order.find((x) => {
            return x.order_id === id;
          });
          check.status = "CANCEL";
          var tempOrder = order.filter((x) => x.order_id !== check.order_id);
          tempOrder.push(check);
          setOrder(tempOrder);
          
        }
      })
      .catch((e) => {
        swal("Error!", "Cancel order unsuccess!", "error");
      });
  }
  function handleRate(rate, idProduct, idOrderDetail, xrate) {
    patchWithToken(
      "/product/rate/" +
        idProduct +
        "?idOrderDetail=" +
        idOrderDetail +
        "&rate=" +
        rate,
      {},
      localStorage.getItem("token")
    )
      .then((res) => {
        
      NotificationManager.success('Rating success', 'success');
        document
          .getElementById(idProduct)
          .setAttribute("data-percent", rate * 20);
      })
      .catch((e) => {
        NotificationManager.error(e.response.data.message, 'error');
        
      });
  }
  const expandRow = {
    renderer: (row) => (
      <div>
        {row.data.orderDetailDTO.map((x) => {
          return (
            <ListGroupItem action>
              <Row>
                <Col md={1}>
                  <Media
                    style={{ height: "50px" }}
                    src={x.productDTO.imageDTOS[0].url}
                  ></Media>
                </Col>
                <Col md={2}>
                  <Link to={"/products/" + x.productDTO.product_id}>
                    {x.productDTO.product_name}
                  </Link>
                </Col>
                <Col md={4}>Quantity: {x.number}</Col>
                <Col md={3} style={{ textAlign: "left" }}>
                  Price: {formatCash(x.number * x.productDTO.price) + " VNĐ"}
                </Col>
                <Col md={2}>
                  {row.data.status === "FINISHED" ? (
                    <div>
                      <div class="product-rating">
                        <div
                          class="stars rate"
                          id={x.productDTO.product_id}
                          data-percent={x.rate * 20}
                        >
                          <a
                            href="#"
                            onClick={() => {
                              handleRate(
                                1,
                                x.productDTO.product_id,
                                x.order_detail_id,
                                x.rate
                              );
                            }}
                            title="awful"
                          >
                            ★
                          </a>
                          <a
                            href="#"
                            onClick={() => {
                              handleRate(
                                2,
                                x.productDTO.product_id,
                                x.order_detail_id,
                                x.rate
                              );
                            }}
                            title="ok"
                          >
                            ★
                          </a>
                          <a
                            href="#"
                            onClick={() => {
                              handleRate(
                                3,
                                x.productDTO.product_id,
                                x.order_detail_id,
                                x.rate
                              );
                            }}
                            title="good"
                          >
                            ★
                          </a>
                          <a
                            href="#"
                            onClick={() => {
                              handleRate(
                                4,
                                x.productDTO.product_id,
                                x.order_detail_id,
                                x.rate
                              );
                            }}
                            title="great"
                          >
                            ★
                          </a>
                          <a
                            href="#"
                            onClick={() => {
                              handleRate(
                                5,
                                x.productDTO.product_id,
                                x.order_detail_id,
                                x.rate
                              );
                            }}
                            title="awesome"
                          >
                            ★
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Col>
              </Row>
            </ListGroupItem>
          );
        })}
        {row.data.status === "CONFIRMED" ? (
          <Button
            onClick={() => {
              handleCancel(row.data.order_id);
            }}
            className="btn btn-danger mt-3"
          >
            Cancel Order
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    ),
    showExpandColumn: true,
  };
  const columns = [
    {
      dataField: "id",
      text: "Order id",
    },
    {
      dataField: "time",
      text: "Order time",
      sort: true,
    },
    {
      dataField: "finishedtime",
      text: "Finished time",
      sort: true,
    },
    {
      dataField: "total",
      text: "Total",
    },
    {
      dataField: "status",
      text: "Status",
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <h1 className="h2">Order list</h1>
      <Dropdown
        className="mb-3"
        isOpen={dropdownOpen}
        toggle={toggle}
        style={{ textAlign: "left" }}
      >
        <DropdownToggle caret className="nameFilter" id="filterName">
          All
        </DropdownToggle>
        <DropdownMenu style={{ width: "15%" }}>
          <DropdownItem
            onClick={() => {
              setList(order);
              document.getElementById("filterName").innerHTML = "All";
            }}
          >
            All
          </DropdownItem>
          {listStatus.map((x) => {
            return (
              <DropdownItem
                onClick={() => {
                  filter(x);
                }}
              >
                {x}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        expandRow={expandRow}
      />
      <NotificationContainer/>
    </div>
  );
};

export default Order;
