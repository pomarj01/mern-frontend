import React, { useState, useContext } from "react";
import api from '../../services/api';
import { UserContext } from '../../user-context'
import {
  Button,
  Form,
  FormGroup,
  Input,
  Container,
  Alert
} from "reactstrap";


// NOTE: a function that returns JSX - reacts way
// of representing a DOM elemnt
// React can modularize your code into components, i.e code splitting
const Login = ({ history }) => {
  // using react hooks for setting states
  const { setIsloggedIn } = useContext(UserContext);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('false');
  
  const handleSubmit = async event => {
    // preventing the page from refreshing
    // when submitting an empty form
    event.preventDefault();
    // console.log(`result of the submit: ${email} and ${password},`)

    const response = await api.post('/login', { email, password })
    // getting the userID from axios respomse, it returns data object
    const user_id = response.data.user_id || false;
    const user = response.data.user || false;
    const firstName = response.data.firstName || false;

    try {
      if (user && user_id) {
        // NOTE: localStorage is a memory inside a browser where data from requests are saved
        // setting setItem as it is a new item and its the first time
        // first argument is the name of the set
        localStorage.setItem("user", user);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("name", firstName);
        // then change route
        // then we want for Login to receive a parameter: 'history' from the router
        setIsloggedIn(true);
        history.push("/");
      } else {
        const { message } = response.data;
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000);
      }
    } catch (error) {
      setError(true)
      setErrorMessage('Error, the server returned an error')
    }
  }

  return (
    <Container>
      <h3>Login:</h3>
      <p>Please <strong>login</strong> into your account</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-2">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="your email"
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2">
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="your password"
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Button className='submit-btn mb-2'>Log in</Button>
          <Button className='secondary-btn submit-btn' onClick={() => history.push('/register')}>Register</Button>
        </FormGroup>
      </Form>
      {error
        ? <Alert className='event-validation' color='danger'> {errorMessage} </Alert>
        : ''
      }
    </Container>
  );
}

export default Login;

