import React from 'react';
import './events.css';
import image1 from './1.png';
import image2 from './2.png';
import image3 from './3.png';
import image4 from './4.png';
import image5 from './5.png';


const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: "Tech Summit 2024",
      description: "Join us for the annual Tech Summit where industry leaders discuss the latest trends and innovations.",
      link: "https://techsummit.com",
      image: image1 // Add image URL for the event
    },
    {
      id: 2,
      title: "Web Development Workshop",
      description: "Learn the fundamentals of web development in this hands-on workshop. No prior experience required!",
      link: "https://webdevworkshop.com",
      image: image2 // Add image URL for the event
    },
    {
      id: 3,
      title: "Data Science Conference",
      description: "Explore the world of data science with talks and workshops from leading experts in the field.",
      link: "https://datascienceconference.com",
      image: image3// Add image URL for the event
    },
    // Add some additional events
    {
      id: 4,
      title: "Mobile App Development Bootcamp",
      description: "Get started with mobile app development and build your first app from scratch.",
      link: "https://mobileappbootcamp.com",
      image: image4 // Add image URL for the event
    },
    {
      id: 5,
      title: "AI & Machine Learning Summit",
      description: "Discover the latest advancements in artificial intelligence and machine learning technologies.",
      link: "https://aiandmlsummit.com",
      image: image5 // Add image URL for the event
    },
  ];

  return (
    <div className="EventsPageContainer">
      <h1 className="EventsPageTitle">All Events</h1>
      <div className="EventsList">
        {events.map(event => (
          <div key={event.id} className="EventItem">
            <img src={event.image} alt={event.title} className="EventImage" />
            <div className="EventContent">
              <h2 className="EventTitle">{event.title}</h2>
              <p className="EventDescription">{event.description}</p>
              <a href={event.link} className="EventLink">Learn more</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
