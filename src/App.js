import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [commentBoxPosition, setCommentBoxPosition] = useState({ x: 100, y: 100 }); // Adjust x and y values as needed

  const handleCalendarClick = (value, event) => {
    setSelectedDate(value);
  };

  const Event_Data_Update = (event) => {
    setEventName(event.target.value);
  };

  const Create_Event_Fun = (e) => {
    e.preventDefault();
    if (selectedDate && eventName) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        title: eventName,
      };
      setEvents([...events, newEvent]);
      setSelectedDate(null);
      setEventName("");
      setSelectedDate(newEvent.date);
    }
  };

  const closeCommentBox = () => {
    setSelectedDate(null);
  };

  const Update_Event_Fun = (eventId, newName) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          title: newName,
          editing: false, // Ensure editing status is set to false after update
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const Delete_Event_Fun = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="calendar-container">
          <Calendar
            value={selectedDate}
            onClickDay={handleCalendarClick}
            tileClassName={({ date }) =>
              selectedDate &&
              date.toDateString() === selectedDate.toDateString()
                ? "selected"
                : events.some(
                    (event) =>
                      event.date.toDateString() === date.toDateString()
                  )
                ? "event-marked"
                : ""
            }
            tileContent={({ date }) => {
              const eventOnDate = events.find(
                (event) => event.date.toDateString() === date.toDateString()
              );
              return eventOnDate ? <div className="event-dot"></div> : null;
            }}
          />
          {selectedDate && (
            <form
              className="comment-box"
              style={{ '--x': commentBoxPosition.x , '--y': commentBoxPosition.y , zIndex:10}}
              onSubmit={Create_Event_Fun}
            >
              <button className="close-button" onClick={closeCommentBox}>
                &#10006;
              </button>
              <h2>Create Event</h2>
              <p>Selected Date: {selectedDate.toDateString()}</p>
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={Event_Data_Update}
              />
              <button type="submit" className="create-btn">
                Click Here to Add Event
              </button>
              {/* Event list */}
              <div className="event-list">
                <h2 style={{ fontSize: "20px" }}>Events List</h2>
                <div className="event-cards">
                  {events.map((event) =>
                    event.date.toDateString() === selectedDate.toDateString() ? (
                      <div key={event.id} className="event-card">
                        <div className="event-card-header">
                          <div className="event-actions">
                            <button
                              className="update-btn"
                              onClick={() => {
                                setEvents((prevEvents) =>
                                  prevEvents.map((prevEvent) =>
                                    prevEvent.id === event.id
                                      ? { ...prevEvent, editing: true }
                                      : prevEvent
                                  )
                                );
                              }}
                            >
                              <span role="img" aria-label="Update">&#9998;</span>
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => Delete_Event_Fun(event.id)}
                            >
                              <span role="img" aria-label="Delete">&#10060;</span>
                            </button>
                          </div>
                        </div>
                        <div className="event-card-body">
                          {event.editing ? (
                            <div className="event-edit-container">
                              <input
                                type="text"
                                value={event.title}
                                onChange={(e) =>
                                  setEvents((prevEvents) =>
                                    prevEvents.map((prevEvent) =>
                                      prevEvent.id === event.id
                                        ? { ...prevEvent, title: e.target.value }
                                        : prevEvent
                                    )
                                  )
                                }
                                onBlur={() => {
                                  Update_Event_Fun(event.id, event.title);
                                }}
                                autoFocus
                              />
                              <button className="ok-btn" onClick={() => Update_Event_Fun(event.id, event.title)}>OK</button>
                            </div>
                          ) : (
                            <p
                              className="event-title"
                              onClick={() => {
                                setEvents((prevEvents) =>
                                  prevEvents.map((prevEvent) =>
                                    prevEvent.id === event.id
                                      ? { ...prevEvent, editing: true }
                                      : { ...prevEvent, editing: false }
                                  )
                                );
                              }}
                            >
                              {event.title}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
