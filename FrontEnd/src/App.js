import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Input from "@mui/material/Input"; // Import Input component

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleCalendarClick = (value, event) => {
    setSelectedDate(value);
    setOpenModal(true);
  };

  const Event_Name_Update = (event) => {
    setEventName(event.target.value);
  };

  const Event_Description_Update = (event) => {
    setEventDescription(event.target.value);
  };

  const Image_Select = (event) => {
    setEventImage(URL.createObjectURL(event.target.files[0])); // Update to store image URL
  };

  const Create_Event_Fun = (e) => {
    e.preventDefault();
    if (selectedDate && eventName && eventDescription && eventImage) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        title: eventName,
        description: eventDescription,
        image: eventImage,
      };
      setEvents([...events, newEvent]);
      setEventName("");
      setEventDescription("");
      setEventImage(null); // Reset image field
      fileInputRef.current.value = ""; // Clear file input field
    }
  };

  const Update_Event_Fun = (eventId, newName, newDescription) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          title: newName,
          description: newDescription,
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

  const handleEdit = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <div className="AppCalender">
        <Calendar
          value={selectedDate}
          onClickDay={handleCalendarClick}
          tileClassName={({ date }) =>
            selectedDate && date.toDateString() === selectedDate.toDateString()
              ? "selected"
              : events.some(
                  (event) => event.date.toDateString() === date.toDateString()
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
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="h2">
              Create Event
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <p>Selected Date: {selectedDate && selectedDate.toDateString()}</p>
          <TextField
            label="Event Name"
            variant="outlined"
            value={eventName}
            onChange={Event_Name_Update}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            value={eventDescription}
            onChange={Event_Description_Update}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Input
            type="file"
            onChange={Image_Select}
            sx={{ mt: 2 }}
            inputRef={fileInputRef}
          />{" "}
          {/* Pass ref to file input */}
          {eventImage && ( // Conditionally render image preview
            <img
              src={eventImage}
              alt="Event"
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}
          <Button onClick={Create_Event_Fun} variant="contained" sx={{ mt: 2 }}>
            Add Event
          </Button>
          <div
            className="event-list"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <Typography variant="h6" component="h2">
              Events
            </Typography>
            {events
              .filter(
                (event) =>
                  event.date.toDateString() ===
                  (selectedDate && selectedDate.toDateString())
              )
              .map((event) => (
                <div key={event.id} className="event">
                  {selectedEvent && selectedEvent.id === event.id ? (
                    <TextField
                      value={event.title}
                      onChange={(e) =>
                        Update_Event_Fun(
                          event.id,
                          e.target.value,
                          event.description
                        )
                      }
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    <Typography>{event.title}</Typography>
                  )}
                  {selectedEvent && selectedEvent.id === event.id ? (
                    <Button
                      onClick={() => setSelectedEvent(null)}
                      variant="contained"
                    >
                      Close
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEdit(event)}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => Delete_Event_Fun(event.id)}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
              ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default App;
