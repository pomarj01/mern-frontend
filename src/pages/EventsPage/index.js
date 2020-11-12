import React, { useState, useMemo, useEffect } from "react";
import api from "../../services/api";
import CameraIcon from "../../assets/camera.png";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Container,
  Alert,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import './events.css'

// will display all the events
export default function EventsPage({history}) {
  const [sport, setSport] = useState("Sport");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const user = localStorage.getItem('user');

  // Redirecting to login if theres no logged in user
  useEffect(() => {
      if (!user) history.push('/login');
  }, [])

  const toggle = () => setOpen(!open);

  // this is an example of a factory function - function that takes another function
  // useMemo - a hook
  // pass in thumbnail in the array - so everytime the value of thumbnail changes,
  // we want to refresh the `preview` property
  // this preview hook is a guide for useMemo to know when it needs to do something or when to trigger the func
  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null
  }, [thumbnail]);

  const submitHandler = async (evt) => {
    evt.preventDefault();
    
    // the request is in multipart form 
    const eventData = new FormData();
    
    eventData.append('thumbnail', thumbnail)
    eventData.append('sport', sport)
    eventData.append('title', title)
    eventData.append('description', description)
    eventData.append('price', price)
    eventData.append('date', date)
   
    try {
      if (
        sport !== '' &&
        title !== '' &&
        description !== '' &&
        price !== '' &&
        date !== '' &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user } })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          history.push('/')
        }, 2000)
      } else {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 2000)

        console.log('Missing required data')
      }
    } catch (error) {
      Promise.reject(error)
      console.log(error);
    }
  };

  const sportsEventHandler = (sport) => setSport(sport);
   
  return (
    <Container>
      <h2>Create your event here: </h2>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label>Upload image:</Label>
          <Label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={thumbnail ? "has-thumbnail" : ""}
          >
            <Input
              type="file"
              // there is a property inside file and we only need the first item
              // file is an array inside target
              onChange={(evt) => setThumbnail(evt.target.files[0])}
            />
            <img
              src={CameraIcon}
              style={{ maxWidth: "50px" }}
              alt="upload icon"
            />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            id="title"
            type="text"
            value={title}
            placeholder="Event title"
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Description:</Label>
          <Input
            id="description"
            type="text"
            value={description}
            placeholder="Event description"
            onChange={(evt) => setDescription(evt.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Price:</Label>
          <Input
            id="price"
            type="text"
            value={price}
            placeholder="Event price"
            onChange={(evt) => setPrice(evt.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            id="date"
            type="date"
            value={date}
            placeholder="Event date"
            onChange={(evt) => setDate(evt.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <ButtonDropdown isOpen={open} toggle={toggle} >
            <Button id="caret" size='sm' value={sport} disabled>
              {sport}
            </Button>
            <DropdownToggle split/>
            <DropdownMenu>
              <DropdownItem onClick={() => sportsEventHandler('running')}>Running</DropdownItem>
              <DropdownItem onClick={() => sportsEventHandler('cycling')}>Cycling</DropdownItem>
              <DropdownItem onClick={() => sportsEventHandler('dating')}>Dating</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="submit-btn"> Create Event </Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn submit-btn" onClick={() => history.push("/")} > Cancel </Button>
        </FormGroup>
      </Form>
      {error
        ? <Alert className="event-validation" color="danger"> Missing required data </Alert>
        : ''
      }
      {success
        ? <Alert className="event-validation" color="success"> Your event was created successfully! </Alert>
        : ''
      }
    </Container>
  );
}
