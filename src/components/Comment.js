import React from "react";
import { Button } from "reactstrap";
import ListComment from "../components/ListComment";
import { postWithToken } from "./ReadAPI";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
export default function Comment(props) {
  let history = useHistory();
  function handleComment() {
    var user=JSON.parse(localStorage.getItem("user"))
    if (handleNull !== false) {
      if(user!==null&&user.customerDTO.avatar!==null)
      {
        postWithToken(
          "/comments?userID=" +
            JSON.parse(localStorage.getItem("user")).user_id +
            "&productID=" +
            props.idProduct,
          {
            content: document.getElementById("Comment").value,
          },
          localStorage.getItem("token")
        )
          .then((res) => {
            if (res.status === 200) {
              swal("Success!", "Comment success", "success");
              setTimeout(() => {
                history.go(0);
              }, 1000);
            }
          })
          .catch((e) => {
            swal("Error!", "Comment unsuccess", "error");
          });
      }else
      {
        user===null? NotificationManager.error("Please login ", "Login"):NotificationManager.error("Please update avatar", "Avatar");
      }
    }
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
    return check;
  }
  return (
    <div>
      <div class="card text-white bg-info mb-1">
        <ListComment idProduct={props.idProduct} />
        <div class="card-header">{localStorage.getItem("fullName")}</div>
        <div class="card-body">
          <div class=" card-text form-group">
            <textarea
              id="Comment"
              placeholder="Comment"
              rows="4"
              class="form-control form-control-lg formvalue"
            ></textarea>
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              handleComment();
            }}
          >
            <i class="fa fa-comment"></i> Comment
          </Button>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}
