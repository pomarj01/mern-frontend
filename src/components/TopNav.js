import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // the router will direct you to a different page without reloading
import { UserContext } from '../user-context'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
} from 'reactstrap';

// This Nav component will need to wrapped inside the BrowserRouter in routes.js
// Reason being for this component to access router context
const TopNav = () => {
  // We now have access to these two global state 
  // using UserContext in conjunction with useContext react function
  // we need to pass in the value of UserContext to useContext()
  // NB: the states need to be destructured as objects and not arrays - so use curly brackets
  const { isLoggedIn, setIsloggedIn } = useContext(UserContext);

  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    setIsloggedIn(false);
  }

  return isLoggedIn
    ?
      <div>
        <Navbar color='faded' light>
          <NavbarToggler onClick={toggleNavbar} className='mr-2' />
          <Link to={'/login'} onClick={logoutHandler}> Logout </Link>
          <Collapse isOpen={!collapsed} navbar>
            <Nav navbar>
              <NavItem> <Link to='/events'> Events </Link> </NavItem>
              <NavItem> <Link to='/'> Dashboard </Link> </NavItem>
              <NavItem> <Link to='/myregistration'> My Registration </Link> </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    : ''
};

export default TopNav;
