import React, { useState, useEffect } from "react";
import "./slider.css";
import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";
import image5 from "./5.png";
import image6 from "./6.png";

const Slider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3; // Number of items per slide
  const autoScrollInterval = 5000; // Interval for auto-scrolling in milliseconds

  const items = [
    {
      title: "Expansion of IIIT-H",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news1",
      image: image1, // Example image URL
    },
    {
      title: "Construction of new classrooms",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news2",
      image: image2, // Example image URL
    },
    {
      title: "Taking research to new heights",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news3",
      image: image3, // Example image URL
    },
    {
      title: "Rain rain go away!",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news4",
      image: image4, // Example image URL
    },
    {
      title: "FELICITY season",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news5",
      image: image5, // Example image URL
    },
    {
      title: "R&D",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news6",
      image: image6, // Example image URL
    },
  ];

  const nextSlide = () => {
    let newStartIndex = startIndex + 1;
    if (newStartIndex >= items.length - 2) {
      newStartIndex = 0; // Reset to the beginning if at the end
    }
    setStartIndex(newStartIndex);
  };

  const prevSlide = () => {
    let newStartIndex = startIndex - 1;
    if (newStartIndex < 0) {
      newStartIndex = items.length - 1; // Go to the end if at the beginning
    }
    setStartIndex(newStartIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [startIndex]);

  return (
    <div className="slider">
      <div
        className="slider-container"
        style={{
          transform: `translateX(-${startIndex * 33}vw)`,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="slider-box">
            <a href={item.link}>
              <div className="slider-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-content">
                  <h2>{item.title}</h2>
                  <p style={{ fontSize: "2vh", marginTop: "2.4vh" }}>
                    {item.content}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Slider;
