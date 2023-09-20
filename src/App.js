import { BrowserRouter, Route ,useHistory} from "react-router-dom";
import "./App.css";
import NavBarAdmin from "./components/AdminSite/NavBarAdmin";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Product from "./components/AdminSite/Product";
import Categories from "./components/AdminSite/Categories";
import { Col, Row } from "reactstrap";
import EditCategories from "./components/AdminSite/EditCategories";
import EditProduct from "./components/AdminSite/EditProduct";
import Home from "./components/Home";
import UserInfo from "./components/UserInfo";
import CategoriesUser from "./components/CategoriesUser";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Order from "./components/Order";
import OrderAdmin from "./components/AdminSite/OrderAdmin";
import Admin from "./components/AdminSite/Admin";
import "react-notifications/lib/notifications.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Permission from "./components/Permission"
function App() {
  function checkPermission(role)
  {
    var userRole=localStorage.getItem("role");
    if(userRole===null)
    {
      return false;
      
    }
    if(userRole===role)
      {
        return true;
      }else{
        return false;
      }
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/">
          <NavBar />
          <Home />
          <Footer />
        </Route>
        <Route exact path="/orders">
          {checkPermission("ROLE_USER")===true?  <div><NavBar />
            <Order />
            <Footer /></div>:<div><Permission/></div>}
          
        </Route>
        <Route exact path="/cart">
        {checkPermission("ROLE_USER")===true?  <div><NavBar />
          <Cart />
          <Footer /></div>:<div><Permission/></div>}
          
        </Route>
        <Route exact path="/admin">
        
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              
            </Col>
          
          
        </Route>
        <Route exact path="/admin/products">
        
          <Row md={1}>
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              <Product />
            </Col>
          </Row>
        </Route>
        <Route exact path="/admin/orders">
          <Row md={1}>
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              <OrderAdmin />
            </Col>
          </Row>
        </Route>
        <Route path="/admin/products/edit/:productID">
          <Row md={1}>
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              <EditProduct />
            </Col>
          </Row>
        </Route>
        <Route exact path="/admin/categories">
          <Row md={1}>
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              <Categories />
            </Col>
          </Row>
        </Route>
        <Route path="/admin/categories/edit/:categoriesID">
          <Row md={1}>
            <Col md={2} sm={2}>
              <NavBarAdmin />
            </Col>
            <Col md={9} sm={9}>
              <EditCategories />
            </Col>
          </Row>
        </Route>
        <Route exact path="/categories/:categoriesID">
          
          <NavBar />
          <CategoriesUser />
          <Footer />
        </Route>
        <Route exact path="/products/:productsID">
          <NavBar />
          <ProductDetail />

          <Footer />
        </Route>
        <Route exact path="/admin/users">
          
              <Row md={1}>
                <Col md={2} sm={2}>
                  <NavBarAdmin />
                </Col>
                <Col md={9} sm={9}>
                  <Admin/>
                </Col>
              </Row>
            
        </Route>
        <Route exact path="/user">
        {checkPermission("ROLE_USER")===true?  <div><NavBar />
          <UserInfo />
          <Footer /></div>:<div><Permission/></div>}
        </Route>
      </div>
      
    </BrowserRouter>
  );
}

export default App;
