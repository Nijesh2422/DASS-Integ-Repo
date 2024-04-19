import React, { useState, useEffect } from "react";
import "./parallax.css"; // Make sure to import your CSS file
import App from "./App";
import Slide from "./slide";
import Slider from "./slider";
import Navbar from "./Navbar2";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ParallaxScroll = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    setShowForm(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNewsTitleChange = (event) => {
    setNewsTitle(event.target.value);
  };

  const handleNewsContentChange = (event) => {
    setNewsContent(event.target.value);
  };

  const handleNewsImageChange = (event) => {
    const file = event.target.files[0]; // Get the first file from the input
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target.result; // Base64 encoded image data
      setNewsImage(imageData); // Update the state with the image data
    };

    // Read the file as a data URL (base64 encoded)
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log("News Title:", newsTitle);
    console.log("News Content:", newsContent);
    console.log("News Image:", newsImage);
    handleCloseModal();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    typeWriter();
  }, []);

  function typeWriter() {
    const textElement = document.querySelector(".typing-animation");
    const text = textElement.textContent;
    textElement.textContent = "";

    let i = 0;
    const speed = 150;

    function type() {
      if (i < text.length) {
        const currentChar = text.charAt(i);

        textElement.insertAdjacentHTML("beforeend", currentChar);

        i++;
        setTimeout(type, speed);
      }
    }

    setTimeout(type, 0);
  }

  const CutoutTextEffect = () => {
    return (
      <div className="image-container">
        <div className="text">
          <div className="fade-in-left">Welcome to</div>
          <div className="typing-animation">IT Services Portal</div>
        </div>
      </div>
    );
  };

  const UpcomingEvents = () => {
    return (
      <ul id="id01" style={{ listStyleType: "none" }}>
        <li>How do I reset my password?</li>
        <li>How do I access remote resources or VPN?</li>
        <li>What are the system requirements for using the portal?</li>
        <li>What IT services are offered by the portal?</li>
        <li>How do I update my contact information?</li>
      </ul>
    );
  };

  return (
    <div>
      {/* Add the Navbar component here */}
      <Navbar />

      <div>
        <div className="parallax">
          <CutoutTextEffect />
        </div>

        <div className="red-section">
          <div style={{ paddingBottom: "2vh" }}>
            <b style={{ fontSize: "30px" }}>
              People have been the foundation of Institute's success
            </b>
          </div>
          <p style={{ fontSize: "20px" }}>
            At IIIT-H, we provide a diverse, inclusive, fair and transparent
            work environment facilitating all stakeholders to grow and flourish.
            We realize that each individual is distinct and unique. Every effort
            is made in recognizing and respecting individual differences,
            ensuring that Institute derives maximum benefit through diverse
            ideas and expertise. Our focus has been to recruit and retain the
            best and provide an ambience for them to excel.
          </p>
          <div style={{ paddingBottom: "2vh", paddingTop: "2vh" }}>
            <b style={{ fontSize: "30px" }}>Key Focus</b>
          </div>
          <p style={{ fontSize: "20px" }}>
            The mission and goals of the institute are greatly influenced by the
            desire to use IT to benefit society at large. Our mission is to
            contribute to the transformation of industry and the community by
            delivering research-led education, promoting innovation and
            fostering human values. Our primary goals are:
            <ul
              style={{
                marginLeft: "3.5%",
                paddingTop: "1.6%",
                paddingBottom: "1.6%",
              }}
            >
              <li>
                Impart education that is comparable in breadth and depth to the
                best in the world; which at the same time nurtures among
                students, an aptitude for research and development, starting
                right with the undergraduate level.
              </li>
              <li>
                Target solutions for societally-relevant problems that can be
                transferred to scalable technologies and enterprises.
              </li>
            </ul>
            What has allowed this fusion of academics and research is the
            presence of exceptional faculty at IIIT-H. We have been successful
            in attracting some of the brightest and most dedicated faculty from
            all over the globe.
          </p>
        </div>

        <div className="news-container">
          <div className="news-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3vh",
              }}
            >
              <h1 style={{ textAlign: "center" }}>News</h1>
              <div
                className="view-all-link"
                onClick={() => navigate(`/view-all-news`)}
              >
                View All
              </div>
            </div>
            <Slider />
          </div>
        </div>

        <div className="calendar-container">
          <div className="centered-text">
            <h1 style={{fontSize:"2.3vw"}}>Calendar</h1>
            <App />
          </div>
          <div className="upcoming-events">
            <div style={{ display:"flex", justifyContent:"center" }}>
              <h1 style={{ textAlign: "center", marginBottom: "0vh", marginLeft:"auto", paddingLeft:"10vw", fontSize:"2.3vw" }}>
                Upcoming Events
              </h1>
              <div
                className="view-all-link"
                onClick={() => navigate(`/view-all-events`)}
              >
                View All
              </div>
            </div>
            <Slide />
          </div>
        </div>
        <div className="FAQ-container">
          <h2 style={{ textAlign: "center" }}>FAQ</h2>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default ParallaxScroll;
