import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import styled from "styled-components";
import Layout from "../../components/Layout/Layout";

export default function Home() {
  return <Layout sidebar>home</Layout>;
}

const HomeMain = styled.main`
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: #eee;
    padding-top: 57px;
    box-shadow: inset 0 0 2px gray;
  }

  .main_contents {
    margin-left: auto;
  }
`;
