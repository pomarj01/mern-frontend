import React, { useState, useEffect } from "react";
import api from '../../services/api'
import './registration.css'
import moment from 'moment'
import {
  Button,
  ButtonGroup,
} from "reactstrap";


export default function MyRegistration() {
  const [ myEvents, setMyEvents ] = useState([]);
  const user = localStorage.getItem('user');

  useEffect(() => {
    getMyEvents()
  }, [])

  const getMyEvents = async () => {
    try {
      const response = await api.get('/registration', { headers: { user }})
      setMyEvents(response.data);
      console.log('11', response.data);
    } catch (error) {
      
    }
  }

  const isApproved = (approved) => approved === true ? ' Approved' : ' Rejected';

  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/approvals`, {}, { headers : { user }});
      getMyEvents();
    } catch (error) {
      console.log(error)
    }
  }

  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(`/registration/${eventId}/rejections`, {}, { headers : { user }});
      getMyEvents();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ul className='events'>
      {myEvents.map(event => 
        <li key={event._id}>
          <div><strong>{event.eventTitle}</strong></div>
          <div className='events-details'>
            <span>Event date: {moment(event.eventDate).format('dddd, MMM Do YYYY')}</span>
            <span>Event price: £{parseFloat(event.eventPrice).toFixed(2)}</span>
            <span>User email: {event.userEmail} </span>
            <span>Status:
              <span className={event.approved !== undefined ? isApproved(event.approved) : 'Pending'}>
                {event.approved !== undefined ? isApproved(event.approved) : 'Pending' }
              </span>
            </span>
          </div>
          <ButtonGroup>
            <Button 
              disabled={event.approved === true || event.approved === false ? true : false }
              color='primary'
              onClick={() => acceptEventHandler(event._id)}
              > 
                Accept
            </Button>
            <Button 
              disabled={event.approved === true || event.approved === false ? true : false }
              color='danger'
              onClick={() => rejectEventHandler(event._id)}
            > 
                Reject
            </Button>
          </ButtonGroup>
        </li>
      )}
    </ul>
  )
}