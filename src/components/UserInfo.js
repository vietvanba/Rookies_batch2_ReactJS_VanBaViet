import React, { useEffect, useState } from "react";
import "../css/UserInfo.css";
import swal from "sweetalert";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
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
  Tab,
  TabPane,
  TabContent,
  Label,
  FormGroup,
  Form,
  Badge,
} from "reactstrap";
import { get, getWithToken, patchWithToken, postWithToken } from "./ReadAPI";
import classnames from "classnames";
export default function UserInfo() {
  let customerStatus;
  let user = JSON.parse(localStorage.getItem("user"));
  let avatar =
    "https://res.cloudinary.com/rookies-app-batch2/image/upload/v1627042158/143086968_2856368904622192_1959732218791162458_n.png_lvl1y7.png";
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        console.log(e.target.result);
        avatar = e.target.result;
        document.getElementById("avatarPreview").setAttribute("src", avatar);
        if (customerStatus !== 404) {
          postWithToken(
            "/customers/avatar?userID=" +
              JSON.parse(localStorage.getItem("user")).user_id,
            avatar,
            localStorage.getItem("token")
          )
            .then((res) => {
              NotificationManager.success("Update Avatar success!", "success");

              customerStatus = 200;
            })
            .catch((e) => {
              NotificationManager.error("Update Avatar unsuccess!", "error");
              console.log(e.response.data);
            });
        } else {
          swal("Error!", "Please update Shipment Detail First!", "error");
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  function handleNull(classname) {
    var x = document.getElementsByClassName(classname);
    var check = true;
    var i;
    for (i = 0; i < x.length; i++) {
      if (x[i].value === "") {
        NotificationManager.error(x[i].name + " must be not blank", x[i].name);
        check = false;
      }
    }
    return check;
  }
  useEffect(() => {
    getWithToken("/customers/" + user.user_id, localStorage.getItem("token"))
      .then((res) => {
        customerStatus = res.status;
        document.getElementById("address").value = res.data.address;
        document.getElementById("phone").value = res.data.phone;
        document
          .getElementById("avatarPreview")
          .setAttribute("src", res.data.avatar);
      })
      .catch((e) => {
        if (e !== undefined) {
          customerStatus = e.response.status;
        }
      });
    document.getElementById("username").value = user.user_name;
    document.getElementById("email").value = user.email;
    document.getElementById("firstname").value = user.first_name;
    document.getElementById("lastname").value = user.last_name;
  }, []);
  function handlerSubmitForm(e) {
    if (handleNull("formCustomer") !== false) {
      if(document.getElementById("phone").value.length===10)
      {
      if (customerStatus === 200) {
        patchWithToken(
          "/customers?userID=" + user.user_id,
          {
            address: document.getElementById("address").value,
            phone: document.getElementById("phone").value,
            avatar: avatar,
          },
          localStorage.getItem("token")
        )
          .then((res) => {
            swal("Success!", "Update information success!", "success");
            customerStatus = 200;
          })
          .catch((e) => {
            swal("Error!", "Update information unsuccess!", "error");
          });
      } else {
        if (customerStatus === 404) {
          postWithToken(
            "/customers?userID=" +
              JSON.parse(localStorage.getItem("user")).user_id,
            {
              user_id: JSON.parse(localStorage.getItem("user")).user_id,
              address: document.getElementById("address").value,
              phone: document.getElementById("phone").value,
              avatar: avatar,
            },
            localStorage.getItem("token")
          )
            .then((res) => {
              swal("Success!", "Update information success!", "success");
              customerStatus = 200;
            })
            .catch((e) => {
              swal("Error!", "Update information unsuccess!", "error");
            });
        }
      }
    }else
    {
      alert("Phone must be 10 char")
    }
    }
  }
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  function handlerSubmitAccountForm() {
    if (handleNull("formAccount") !== false) {
      patchWithToken(
        "/users?id=" + user.user_id,
        {
          first_name: document.getElementById("firstname").value,
          last_name: document.getElementById("lastname").value,
        },
        localStorage.getItem("token")
      )
        .then((res) => {
          user.first_name = res.data.first_name;
          user.last_name = res.data.last_name;
          localStorage.setItem("user", JSON.stringify(user));
          swal("Success!", "Update Account information success!", "success");
        })
        .catch((e) => {
          swal("Error!", "Update Account information unsuccess!", "error");
        });
    }
  }
  return (
    <div>
      <Row className="mt-3">
        <Col md={5}>
          <div></div>
        </Col>
        <Col md={2}>
          <Label for="avatar">
            <Media
              id="avatarPreview"
              className="rounded-circle"
              src={avatar}
              style={{ width: "200px", height: "200px" }}
            ></Media>
          </Label>
          <Input
            type="file"
            name="avatar"
            id="avatar"
            className="upload-photo"
            onChange={(e) => {
              readURL(e.target);
            }}
          />
        </Col>
        <Col md={5}>
          <div></div>
        </Col>
      </Row>

      <Nav tabs className="mt-3">
        <Col md={6}>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              Shipment Details
            </NavLink>
          </NavItem>
        </Col>
        <Col md={6}>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              Account Details
            </NavLink>
          </NavItem>
        </Col>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <div className="UserInfo">
                <Form className="mt-3">
                  <FormGroup className="mt-3">
                    <Label for="address">Address</Label>
                    <Input
                      className="formCustomer"
                      type="text"
                      name="address"
                      id="address"
                      placeholder="1234 Main St, District,City, VN"
                      maxLength="256"
                      required
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="phone">Phone number</Label>
                    <Input
                      className="formCustomer"
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="0001112222"
                      maxLength="10"
                      minLength="10"
                      required
                    />
                  </FormGroup>
                </Form>
                <Row className="mt-3">
                  <Col md={4}>
                    <div></div>
                  </Col>
                  <Col md={4}>
                    <Button
                      onClick={() => {
                        handlerSubmitForm();
                      }}
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      Update Shipment Details
                    </Button>
                  </Col>
                  <Col md={4}>
                    <div></div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <div className="UserInfo">
                <Form className="mt-3">
                  <FormGroup className="mt-3">
                    <Label for="username">Username</Label>
                    <Input
                      className="formAccount"
                      type="text"
                      name="username"
                      id="username"
                      disabled
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="password">Password</Label>
                    <Input
                      className="formAccount"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="email">Email</Label>
                    <Input
                      className="formAccount"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="1234 Main St, District,City, VN"
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="firstname">First name</Label>
                    <Input
                      className="formAccount"
                      type="text"
                      name="firstname"
                      id="firstname"
                      placeholder="First name"
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Label for="lastname">Last name</Label>
                    <Input
                      className="formAccount"
                      type="text"
                      name="lastname"
                      id="lastname"
                      placeholder="Last name"
                    />
                  </FormGroup>
                </Form>
                <Row className="mt-3">
                  <Col md={4}>
                    <div></div>
                  </Col>
                  <Col md={4}>
                    <Button
                      onClick={() => {
                        handlerSubmitAccountForm();
                      }}
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      Update Account Details
                    </Button>
                  </Col>
                  <Col md={4}>
                    <div></div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
      <NotificationContainer />
    </div>
  );
}
