import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./assets/Order.css";
import { getWithToken, patchWithToken } from "../ReadAPI";
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
  DropdownToggle,Alert,Dropdown
} from "reactstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const Order = (props) => {
  const [order, setOrder] = useState([]);
  const [alert, setAlert] = useState(false);
  const [list, setList] = useState([]);
  const listStatus = [
    "CONFIRMED",
    "IN_TRANSIT",
    "DELIVERY_ORDER",
    "FINISHED",
    "CANCEL",
  ];
  const history = useHistory()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  useEffect(() => {
    getWithToken("/orders", localStorage.getItem("token")).then((res) => {
      setOrder(res.data);
      setList(res.data.filter((x) => x.status === "CONFIRMED"));
      document.getElementById("filterName").innerHTML="CONFIRMED"
    });
  }, []);
  function filter(key) {
    document.getElementById("filterName").innerHTML = key;
    setList(order.filter((x) => x.status === key));
  }
  const products = list.map((p) => {
    var localDate = new Date(p.order_time)
    var fistime ="Unfinished"
    if(p.finish_time!==null)
    {
      fistime=new Date(p.finish_time).toLocaleString()
    }
    
    return {
      id: p.order_id,
      time: localDate.toLocaleString(),
      finishedtime:fistime,

      total: formatCash(p.total_price) + " VNĐ",
      status: p.status,
      user: p.userDTO.user_name,
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
  function handleOnChange(id,e) {
    patchWithToken("/orders/"+id+"?status="+e.target.value,{},localStorage.getItem('token')).then((res)=>{
      if(res.status===200)
      {
        onShowAlert()
        history.go(0);
        // let check=order.find((x)=>{return x.order_id===id});
        // let key =check.status;
        // check.status=e.target.value;
        // let temp =order.filter((x) => x.order_id !== id)
        // temp.push(check)
        // setOrder(temp);
        // setList(order.filter((x) => x.status === key));
      }
    }).catch((e)=>{
      swal("Error","Can't change status","error")
    })
  }
  function onShowAlert() {
    setAlert(true);
    setTimeout(()=>{
        setAlert(false)
      },1000)
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
                <Col md={3}>
                  <Link to={"/products/" + x.productDTO.product_id}>
                    {x.productDTO.product_name}
                  </Link>
                </Col>
                <Col md={4}>Quantity: {x.number}</Col>
                <Col md={3} style={{ textAlign: "left" }}>
                  Price: {formatCash(x.number * x.productDTO.price) + " VNĐ"}
                </Col>
              </Row>
            </ListGroupItem>
          );
        })}
        {row.data.status !== "CANCEL"&&row.data.status !=="FINISHED" ? (
          <div className="mt-4 mb-3">
            <Row>
              <Col md={2}></Col>
              <Col md={2}>
                <Label for="exampleSelect" className="mt-2">
                  Select status
                </Label>
              </Col>
              <Col md={6}>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  onChange={(e)=>{
                    handleOnChange(row.data.order_id,e)
                  }}
                  value={row.data.status}
                >
                  <option>CONFIRMED</option>
                  <option>IN_TRANSIT</option>
                  <option>DELIVERY_ORDER</option>
                  <option>FINISHED</option>
                  <option>CANCEL</option>
                </Input>
              </Col>
              <Col md={2}></Col>
            </Row>
          </div>
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
    {
      dataField: "user",
      text: "Username",
      sort: true,
    },
  ];
  return (
    
    <div style={{ padding: "20px" }}>
      <Alert color="success"isOpen={alert}>Change success</Alert>
      <h1 className="h2">Order list</h1>
      <Dropdown
        className='mb-3'
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
    </div>
  );
};

export default Order;
