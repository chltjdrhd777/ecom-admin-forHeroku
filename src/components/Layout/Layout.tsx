import React, { PropsWithChildren, ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/mainReducer";

export default function Layout(props: PropsWithChildren<{ sidebar?: boolean }>) {
  const { userInfo } = useSelector(selectUser);

  return (
    <>
      <Header />
      {props.sidebar ? (
        <HomeMain>
          <Container fluid>
            <Row>
              <Col md={2} className="sidebar">
                <ul>
                  <li>
                    <NavLink exact to="/">
                      Home
                    </NavLink>
                  </li>
                  {userInfo !== undefined && userInfo.role === "admin" && (
                    <>
                      <li>
                        <NavLink to="/page">Pages</NavLink>
                      </li>
                      <li>
                        <NavLink to="/products">Products</NavLink>
                      </li>
                      <li>
                        <NavLink to="/category">Category</NavLink>
                      </li>
                    </>
                  )}

                  <li>
                    <NavLink to="/orders">Orders</NavLink>
                  </li>
                </ul>
              </Col>
              <Col md={10} className="main_contents">
                {props.children}
              </Col>
            </Row>
          </Container>
        </HomeMain>
      ) : (
        props.children
      )}
    </>
  );
}

const HomeMain = styled.main`
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: #eee;
    padding: 57px 0 0 0;
    box-shadow: inset 0 0 2px gray;

    & ul {
      margin: 0;
      padding: 0;

      & li {
        list-style: none;

        & a {
          display: block;
          color: #798183;
          padding: 1rem 2rem;
          box-sizing: border-box;
          margin: 0.3rem 0 0.3rem 0.6rem;
          text-decoration: none;
          border-radius: 10px 0 0 0;

          &.active {
            background-color: #fff;
          }
        }
      }
    }
  }

  .main_contents {
    margin-left: auto;
    padding: 57px 0 0 0;
  }
`;
