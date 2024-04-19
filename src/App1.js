import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import './app5.css';

const localizer = momentLocalizer(moment);

function App() {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAddEventClick = () => {
    if (newEventTitle && newEventDate) {
      const newEvent = {
        title: newEventTitle,
        start: new Date(newEventDate),
        end: new Date(newEventDate),
      };

      setEvents([...events, newEvent]);

      setNewEventTitle('');
      setNewEventDate('');
    }
  };

  const handleSelectEvent = (event) => {
    // Handle the event click, for example, display details or navigate to a specific page
    setSelectedEvent(event);
  };

  return (
    <div className="App">
      {/* Calendar */}
      <div className="calendar">
        <h2>Calendar</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
        />
        <input
          type="date"
          placeholder="Event Date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
        />
        <button onClick={handleAddEventClick}>Add Event</button>

        <Calendar
          localizer={localizer}
          events={events}
          views={['month']}
          step={40}
          showMultiDayTimes={false}
          defaultDate={new Date()}
          toolbar={false}
          onSelectEvent={handleSelectEvent}
        />

        {/* Display details of the selected event */}
        {selectedEvent && (
          <div>
            <h3>Selected Event Details</h3>
            <p>Title: {selectedEvent.title}</p>
            <p>Start Time: {selectedEvent.start.toString()}</p>
            <p>End Time: {selectedEvent.end.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
