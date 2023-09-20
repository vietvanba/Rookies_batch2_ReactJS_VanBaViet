import React, { useEffect, useState } from "react";
import { Col, Label, Row, Form, FormGroup, Input } from "reactstrap";
import { useParams } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import swal from "sweetalert";
import { get, patchWithToken, post, del } from "../ReadAPI";

export default function EditCategories(props) {
  const [categories, setcategories] = useState();
 const {categoriesID}=useParams();
  useEffect(() => {
    get(`/categories/${categoriesID}`)
      .then((response) => {
        setcategories(response.data);
        console.log(categories);
        document.getElementById("id").value = response.data.product_categories_id;
        document.getElementById("name").value = response.data.name;
        document.getElementById("description").value = response.data.description;
      })
      .catch((error) => console.log(error));
  },[document.getElementById("description"),document.getElementById("name")]);
  async function handlerSubmitForm() {
    if(handleNull()!=false)
    {
    document.getElementById("btnSave").innerHTML =
      '<div class="spinner-border spinner-border-sm"></div>';
    await patchWithToken(
      "/categories?id="+categories.product_categories_id,
      {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
      },
      localStorage.getItem("token")
    )
      .then((res) => {
        if (res.status === 200) {
          document.getElementById("btnSave").innerHTML = "Save";
          swal("Success!", "Categories has been edited!", "success");
          
        }
        console.log(res);
      })
      .catch((err) => {
        document.getElementById("btnSave").innerHTML = "Save";
      });
  }}
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
    <div>
      <Form className="form">
      <Row>
          <FormGroup>
            <Label for="id">Name</Label>
            <Input type="text" name="id" id="id" disabled></Input>
          </FormGroup>
        </Row>
        <Row>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" className="formvalue"></Input>
          </FormGroup>
        </Row>
        <Row>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" name="description" id="description" className="formvalue"/>
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
      <NotificationContainer/>
    </div>
  );
}
