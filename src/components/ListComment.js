import React, { useState,useEffect } from "react";
import { Collapse, Button, CardBody,Media, Card, Row, Col ,ListGroup,ListGroupItem} from "reactstrap";
import {get} from './ReadAPI'
export default function ListComment(props) {
  const [isOpen, setIsOpen] = useState(true);
const [comments, setComments] = useState([])
  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
      get("/comments?idProduct="+props.idProduct).then((res)=>{
          if(res.status===200)
          {
              setComments(res.data);
          }
      })
  }, [])
  return (
    <div>
      <Row>
        <Col md={1}>
          <Button
            color="primary"
            onClick={toggle}
            style={{ marginBottom: "1rem" }}
          >
            {isOpen? "Close":"Open"}
          </Button>
        </Col>
        <Col md={11}></Col>
      </Row>

      
      <Collapse isOpen={isOpen}>


      <ListGroup>
      {comments.length===0? <div>Không có bình luận nào</div>:comments.map(x=>{
          var localDate = new Date(x.time)
          return(
            <ListGroupItem>
<Row>
            <Col md={1}>
            <Media
              id="avatarPreview"
              className="rounded-circle"
              src={x.userDTO.customerDTO.avatar}
              style={{ width: "50px", height: "50px" }}
            ></Media>
            </Col>
            <Col md={2} >{x.userDTO.first_name}{x.userDTO.last_name} <br/>{localDate.toLocaleString()}
            </Col>
            <Col md={8} style={{textAlign:'left'}}>{x.content}</Col>
</Row>
               
            </ListGroupItem>
          )
      })}
      
    </ListGroup>
      </Collapse>
    </div>
  );
}
