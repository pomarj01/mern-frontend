import React, { useState, useContext } from "react";
import api from "../../services/api";
import { UserContext } from '../../user-context'
import { Button, Form, FormGroup, Input, Container, Alert } from "reactstrap";

export default function Register({ history }) {
  const { setIsloggedIn } = useContext(UserContext);
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ success, setSuccess ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ messageHandler, setMessageHandler ] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (
        email !== "" &&
        password !== "" &&
        firstName !== "" &&
        lastName !== ""
      ) {
        const response = await api.post("/user/register/", {
          email,
          password,
          firstName,
          lastName,
        });
        // getting the userID from axios response, it returns data object
        const user = response.data.user || false;
        const user_id = response.data.user_id || false;

        if (user && user_id) {
          localStorage.setItem("user", user);
          localStorage.setItem("user_id", user_id);
          setSuccess(true);
          setMessageHandler("Account created successfully!");
          setTimeout(() => {
            setSuccess(false);
            setMessageHandler("");
            setIsloggedIn(true);
            history.push("/");
          }, 2000);
        } else {
          const { message } = response.data;
          setError(true);
          setMessageHandler(message);
          setTimeout(() => {
            setError(false);
            setMessageHandler("");
          }, 2000);
        }
      } else {
        setError(true);
        setMessageHandler("You need to fill all the fields");
        setTimeout(() => {
          setError(false);
          setMessageHandler("");
        }, 2000);
      }
    } catch (error) {
      // Promise.reject(error);
      setError(true);
      setMessageHandler('Email already exist! Log in instead.');
      setTimeout(() => {
        setError(false);
        setMessageHandler('');
      }, 2000);
    }
  };

  return (
    <Container>
      <h3>Register:</h3>
      <p> Please <strong> register </strong> a new account </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-2 ">
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First name"
            onChange={(evt) => setFirstName(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 ">
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last name"
            onChange={(evt) => setLastName(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 ">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="your email"
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 ">
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="your password"
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </FormGroup>
        <Button color="success" className="submit-btn">
          Register
        </Button>
      </Form>
      {error
        ? <Alert className='event-validation' color='danger'> {messageHandler} </Alert>
        : ''
      }
      {success
        ? <Alert className="event-validation" color="success"> {messageHandler} </Alert>
        : ''
      }
    </Container>
  );
}
