import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { loadingState, userLogins } from "../../redux/userSlice";
import { useState } from "react";
import { selectUser } from "../../redux/mainReducer";
import { Redirect } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { userInfo } = useSelector(selectUser);

  const userLogin = (e?: any) => {
    e.preventDefault();
    dispatch(loadingState("pending"));
    dispatch(userLogins({ email, password }));
    dispatch(loadingState("finished"));
    setEmail("");
    setPassword("");
  };

  if (userInfo?.token) return <Redirect to="/" />;
  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={userLogin}>
              <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
