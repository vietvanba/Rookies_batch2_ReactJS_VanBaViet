import React from 'react'
import {
    Input,
    Button,
    Col,
    Label,
    FormGroup,
    Form,
  } from "reactstrap";
  import { postWithToken } from "../ReadAPI";
  import swal from "sweetalert";
export default function Admin() {
    function handleSignUpFormSubmit() {
        postWithToken("/admin/users",{
            username:document.getElementById('username').value,
            password:document.getElementById("password").value,
            first_name:document.getElementById("firstname").value,
            last_name:document.getElementById("lastname").value,
            email:document.getElementById("email").value,
        },localStorage.getItem('token')).then((res)=>{
            swal("Success!","Created Account","success")
        }).catch((err)=>{
            swal("Error!",err.response.data.message,"error")
        })
    }
    return (
        <div>
            <h1>Add new admin account</h1>
            <Form >
            <FormGroup row className="mb-3">
              <Label for="username" sm={3}>
                Username
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="user"
                  id="username"
                  placeholder="Username"
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="password" sm={3}>
                Password
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="email" sm={3}>
                Email
              </Label>
              <Col sm={9}>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="firstname" sm={3}>
                Username
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="First name"
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-3">
              <Label for="lastname" sm={3}>
                Username
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="Last name"
                />
              </Col>
            </FormGroup>

            <Button onClick={() => handleSignUpFormSubmit()}>Create</Button>
            </Form>
        </div>
    )
}
