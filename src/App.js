import React from "react";
import Routes from './routes';
import { Container } from 'reactstrap';
import { ContextWrapper } from './user-context' // Wrap ContextWarpper with brackets as it is not exported as default
import "./App.css";


function App() {
  return (
    <ContextWrapper>
      <Container>
        <h1>Sports App</h1>
        <div className='content'>
          <Routes />
        </div>
      </Container>
    </ContextWrapper>
  );
}

export default App;
