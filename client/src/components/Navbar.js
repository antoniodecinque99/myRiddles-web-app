import { useContext} from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import LoginContext from "../loginContext";
import { doLogout } from "../APICalls";

import logo from '../assets/logo.png'

function MyNavbar(props) {
   const navigate = useNavigate();
   const loginContext = useContext(LoginContext);
   
   const handleLogout = async () => {
      if (await doLogout()) {
         loginContext.setUser(undefined);
         navigate("/login");
      }
   }

   return (
      <Navbar sticky="top" style={{fontFamily: "Lato-Bold", marginBottom: "25px"}} collapseOnSelect expand="lg" bg="dark" variant="dark">
         <Container>
            <Navbar.Brand>
               <img
                  src={logo}
                  alt=""
                  style={{ width: '40px', margin: '15px' }}
               />
               SolveMyRiddle
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link onClick={() => { navigate("/leaderboard") }}><Icon.TrophyFill style={{ margin: '5px' }}></Icon.TrophyFill>Leaderboard</Nav.Link>
                  <Nav.Link onClick={() => { navigate("/") }}><Icon.QuestionCircleFill style={{ margin: '5px' }}></Icon.QuestionCircleFill>All Riddles</Nav.Link>
                  { loginContext.user && <Nav.Link onClick={() => { navigate("/newriddle") }}><Icon.PencilFill style={{ margin: '5px' }}></Icon.PencilFill>Create new Riddle</Nav.Link> }
               </Nav>

               <Nav>
                  {
                     loginContext.user ?
                        <NavDropdown title={<span><strong>{loginContext.user.username}</strong> | Score: {props.score}</span>} id="collasible-nav-dropdown">

                           <NavDropdown.Item onClick={() => { navigate("/myriddles") }}>
                              <Icon.BookmarkStarFill style={{ margin: "5px" }}></Icon.BookmarkStarFill>My Riddles
                           </NavDropdown.Item>

                           <NavDropdown.Divider />

                           <NavDropdown.Item onClick={() => { handleLogout() }}>
                              <Icon.BoxArrowInLeft style={{ margin: "5px" }}></Icon.BoxArrowInLeft>Logout
                           </NavDropdown.Item>
      
                        </NavDropdown> :
                        <Nav.Link onClick={() => { navigate("/login") }}><Icon.BoxArrowInRight style={{ margin: "5px" }}></Icon.BoxArrowInRight>Login</Nav.Link>
                  }
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );


}

export default MyNavbar;