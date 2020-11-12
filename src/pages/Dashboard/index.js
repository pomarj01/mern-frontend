import React, { useEffect, useState, useMemo } from "react";
import api from '../../services/api'
import './dashboard.css'
import moment from 'moment'
import {
  Button,
  ButtonGroup,
  Alert,
  Card,
  CardText,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import socketio from 'socket.io-client';

// history props is coming from the router
export default function Dashboard({ history }) {
  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');

  const [ events, setEvents ] = useState([]);
  const [ rSelected, setRSelected ] = useState(null);
  const [ success, setSuccess ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ messageHandler, setMessageHandler ] = useState('');
  const [ eventRequests, setEventRequests ] = useState([]);
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ eventRequestMessage, setEventRequestMessage ] = useState('');
  const [ eventRequestSuccess, setEventRequestSuccess ] = useState(false);

  const toggleMenu = () => setDropdownOpen(!dropdownOpen);

  // NOTE: useEffect - a hook that take cares all the side effects of the application.
  // Everytime the component renders, it triggers useEffect. Like 'componentDidMount', etc.
  // useEffect takes a function/does a function call then pass an empty array
  useEffect(() => {
    getEvents();
  }, [])

  // using useMemo for computing memoized value when one of the deps has changed
  // meaning we want to keep the same id of the socket by passing an array of user_id
  // because if the user_id changes then we want the refresh the socket
  const socket = useMemo(() => 
    socketio("http://localhost:8000/", { query: { user: user_id } }),
    [user_id]
  );

  useEffect(() => {
    // everytime the socket gets data, we add it on the eventRequest array
    // use spread function on eventRequest
    // we're passing the eventRequests array and socket in
    // the input to refresh the page when it changes 
    socket.on('registration_request', data => (setEventRequests([...eventRequests, data])))
  }, [eventRequests, socket])

  const getEvents = async (query) => {
    try {
      const url = query ? `/dashboard/${query}` : '/dashboard'
      // make sure we are sending the header with the user_id
      // so we need to check if youre logged in or not
      const res = await api.get(url, { headers: { user } });
      // data is an object inside `res`
      setEvents(res.data.events)
    } catch (error) {
      history.push('/login')
    }
    
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user: user } });
      setSuccess(true)
      setMessageHandler('Event has been deleted successfully!')
      setTimeout(() => {
        setSuccess(false)
        filterHandler(null)
        setMessageHandler('');
      }, 2500)
      history.push('/')
    } catch (error) {
      setError(true)
      setMessageHandler('Error when deleting event!')
      setTimeout(() => {
        setError(false)
        setMessageHandler('');
      }, 2000)
    }
  }

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const myEventHandler = async () => {
    try {
      setRSelected('myevents');
      const res = await api.get("/user/events", { headers: { user } });
      setEvents(res.data.events)
    } catch (error) {
      history.push('/login')
    } 
  }

  const registrationHandler = async (event) => {
    try {
      // adding an empty object as we are not sending any data
      // NOTE: but will have to send in the header the user for authentication
      api.post(`/registration/${event.id}`, {}, { headers: { user } });
      setSuccess(true);
      setMessageHandler(`Subscription to ${event.title} was successful!`);
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler('');
      }, 2500)
    } catch (error) {
      setError(true);
      setMessageHandler(`Unable to subscribe to ${event}!`);
      setTimeout(() => {
        setError(false)
        setMessageHandler('')
      })
    }
  }

  const acceptHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/approvals`, {}, { headers : { user }});
      setEventRequestSuccess(true);
      setEventRequestMessage(`Event approved successfully`);
      removeEventNotification(eventId);
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage('');
      }, 2000)
    } catch (error) {
      setError(true);
      setEventRequestMessage('Unable to approve event!')
      setTimeout(() => {
        setError(false);
        setEventRequestMessage('')
      }, 2000)
    }
  }

  const rejectHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/rejections`, {}, { headers : { user }});
      setEventRequestSuccess(true);
      setEventRequestMessage(`Event rejected successfully`);
      removeEventNotification(eventId);
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage('');
      }, 2000)
    } catch (error) {
      setError(true);
      setEventRequestMessage('Unable to reject event!')
      setTimeout(() => {
        setError(false);
        setEventRequestMessage('')
      }, 2000)
    }
  }

  const removeEventNotification = (eventId) => {
    const newEvents = eventRequests.filter((event) => event._id !== eventId);
    console.log(newEvents);
    setEventRequests(newEvents);
  }

  return (
    <>
      {eventRequests.length !== 0 &&  
        <Card style={{ background: '#d2f3ff', marginBottom: '20px', boxShadow: '0 1px 2px -1px #000000'}}>
          {eventRequests.map(request => {
            console.log(eventRequests)
            return (
              <CardBody key={request._id}>
                <CardText> 
                  <strong> ({request.user.email}) </strong> 
                  is requesting to subscribe to your event: {request.event.title}
                </CardText>
                <ButtonGroup>
                  <Button color='primary' onClick={() => acceptHandler(request._id)}> Accept </Button>
                  <Button color='danger' onClick={() => rejectHandler(request._id)}> Reject </Button>
                </ButtonGroup>
                <div></div>
                {eventRequestSuccess && 
                  <Alert className="event-validation" color="success" style={{backgroundColor: '#8fe4a3' }}> {eventRequestMessage} </Alert>
                }
              </CardBody>
            )}
          )}
        </Card>
      }
      <div className='filter-tab'>
        <Dropdown isOpen={dropdownOpen} toggle={toggleMenu}>
          <DropdownToggle color='primary' caret> Filter </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}> All Sports </DropdownItem>
            <DropdownItem onClick={myEventHandler} active={rSelected === 'myevents'}> My Events </DropdownItem>
            <DropdownItem onClick={() => filterHandler('running')} active={rSelected === 'running'}> Running </DropdownItem>
            <DropdownItem onClick={() => filterHandler('cycling')} active={rSelected === 'cycling'}> Cycling </DropdownItem>
            <DropdownItem onClick={() => filterHandler('dating')} active={rSelected === 'dating'}>Dating </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <ButtonGroup>
          <Button onClick={() => history.push('/events')}> Create Event </Button>
        </ButtonGroup>
      </div>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id}>
            <header style={{ backgroundImage: `url(${event.thumbnail_url})`, }}>
              {event.user === user_id
                ? <Button color='danger' size='sm' onClick={() => deleteEvent(event._id)}> Delete Event </Button>
                : ''
              }
            </header>
            <strong>{event.title}: </strong>
            <span style={{ fontStyle: 'italic' }}>{event.description}</span>
            <span>£{parseFloat(event.price).toFixed(2)}</span>
            {event.date
              ? <span> {moment(event.date).format('[on] dddd, MMM Do YYYY')} </span>
              : null
            }
            <Button color='info' onClick={() => registrationHandler(event)}> Reg Request </Button>
          </li>
        ))}
      </ul>
      {error
        ? <Alert className="event-validation" color="danger">  {messageHandler} </Alert>
        : ''
      }
      {success
        ? <Alert className="event-validation" color="success"> {messageHandler} </Alert>
        : ''
      }
    </>
  );
}
 