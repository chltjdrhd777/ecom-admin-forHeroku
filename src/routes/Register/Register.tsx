import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/mainReducer";
import { loadingState, userRegisters, errorhandler } from "../../redux/userSlice";
import { Redirect } from "react-router-dom";

export default function Register(props: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLasttName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerState, setRegisterState] = useState("ready");

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user.error.success === true) {
      dispatch(errorhandler(false));
    }
  }, []);

  function inputMaker(setState: Function) {
    return (e: any) => {
      setState(e.target.value);
    };
  }

  const userRegister = (e?: any) => {
    const data = { firstName, lastName, email, password };
    e.preventDefault();
    dispatch(loadingState("pending"));
    dispatch(userRegisters({ ...data }));
    dispatch(loadingState("finished"));
    setRegisterState("success");
  };

  if (user.error.success === true && user.userInfo && registerState === "success") {
    return <Redirect to="/" />;
  }

  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={userRegister}>
              <Row>
                <Col md={6}>
                  <Input label="First Name" type="text" placeholder="Enter first name" value={firstName} onChange={inputMaker(setFirstName)} />
                </Col>

                <Col md={6}>
                  <Input label="Last Name" type="text" placeholder="Enter Last name" value={lastName} onChange={inputMaker(setLasttName)} />
                </Col>
              </Row>

              <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={inputMaker(setEmail)} />
              <Input label="Password" type="password" placeholder="Enter password" value={password} onChange={inputMaker(setPassword)} />

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
