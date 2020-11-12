// HTTPS request handler
import axios from 'axios';

// initialising axios by using create() method
// by passing basic configuration
// this api handles the middleware communication
// between frontend & backend 
const api = axios.create({
  // url from the backend - 8000 for development
  // baseURL: 'http://localhost:8000/'
  baseURL: 'https://mern-sports-app-backend.herokuapp.com'
})

// use export default as 'const' is used
export default api;