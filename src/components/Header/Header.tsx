import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout, userLogouts } from "../../redux/userSlice";
import { selectUser } from "../../redux/mainReducer";

export default function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(selectUser);

  const logoutFunc = () => {
    dispatch(userLogouts({}));
  };

  //when loggedIn and out
  const ifLoggedIn = () => {
    return (
      <Nav>
        <li className="nav-item">
          <span className="nav-link logout_btn" onClick={logoutFunc} style={{ cursor: "pointer" }}>
            Log out
          </span>
        </li>
      </Nav>
    );
  };

  const ifLoggedOut = () => {
    return (
      <Nav>
        <li className="nav-item">
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        </li>
      </Nav>
    );
  };

  return (
    <Navbar collapseOnSelect fixed="top" expand="lg" bg="dark" variant="dark" className="navbar" style={{ zIndex: 1 }}>
      <Container fluid>
        <Link to="/" className="navbar-brand">
          Admin Dashboard
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"></Nav>
          {userInfo && userInfo.token ? ifLoggedIn() : ifLoggedOut()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
