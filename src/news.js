import React, { useState, useEffect } from "react";
import "./NewsPage.css"; // Import CSS file for styling
import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";
import image5 from "./5.png";
import image6 from "./6.png";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import Footer from "./Footer.js";
import Button from "@mui/material/Button";

Quill.register("modules/imageResize", ImageResize);
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // [{ align:[ '', 'left', 'center', 'right', 'justify']}]
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ], // Alignment options
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

function NewsPage() {
  const [newsItems, setnewsItems] = useState([]);

  // Array of news items
  const fetchedItems = [
    {
      title: "Expansion of IIIT-H",
      content:
        "IIIT Hyderabad announces the expansion of its campus to accommodate more students. The expansion plan includes the construction of new buildings, research facilities, and recreational areas.",
      link: "https://example.com/news1",
      image: image1,
      isdone: true,
    },
    {
      title: "Construction of new classrooms",
      content:
        "As part of its development initiative, IIIT Hyderabad begins the construction of new classrooms to cater to the increasing student population. The new classrooms will be equipped with modern amenities to enhance the learning experience.",
      link: "https://example.com/news2",
      image: image2,
      isdone: true,
    },
    {
      title: "Taking research to new heights",
      content:
        "IIIT Hyderabad's research efforts reach new heights with groundbreaking discoveries and collaborations. The institute continues to push the boundaries of knowledge in various fields, contributing to advancements in science and technology.",
      link: "https://example.com/news3",
      image: image3,
      isdone: true,
    },
    {
      title: "Rain rain go away!",
      content:
        "Heavy rainfall disrupts normal life in Hyderabad as the city experiences flooding in several areas. Authorities are on high alert, and relief efforts are underway to assist affected residents and minimize the damage caused by the rain.",
      link: "https://example.com/news4",
      image: image4,
      isdone: true,
    },
    {
      title: "FELICITY season",
      content:
        "IIIT Hyderabad's annual cultural fest, FELICITY, is back with a bang! Students gear up for a week-long extravaganza filled with competitions, workshops, performances, and much more. Get ready to unleash your creativity and celebrate the spirit of FELICITY!",
      link: "https://example.com/news5",
      image: image5,
      isdone: true,
    },
    {
      title: "R&D",
      content:
        "IIIT Hyderabad's Research and Development (R&D) department continues to drive innovation and excellence. With a focus on cutting-edge technologies and interdisciplinary collaboration, the institute aims to address global challenges and make a positive impact on society.",
      link: "https://example.com/news6",
      image: image6,
      isdone: true,
    },
  ];

  useEffect(() => {
    setnewsItems(fetchedItems);
    // eslint-disable-next-line
  }, []);

  const [editStates, seteditStates] = useState(
    Array.from({ length: fetchedItems.length }, () => ({
      editImage: false,
      editText: false,
    }))
  );

  const handlestateChange = (attribute, value, index) => {
    const newStates = [...editStates];
    newStates[index] = { ...editStates[index], [attribute]: value };
    seteditStates(newStates);
  };

  async function uploadImageFunction(image) {
    try {
      const formData = new FormData();
      formData.append("image_name_in_form", image);

      const response = await fetch(`/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      } else {
        const responseData = await response.json();
        return responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handlechangeImage = async (e, index, item) => {
    const newItems = [...newsItems];
    const files = e.target.files;
    console.log(index);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const res = await uploadImageFunction(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newItems[index] = {
            ...item,
            image: "../" + res.imagepath,
          };
          setnewsItems([...newItems]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  function DisplayText({ item, index }) {
    const [textContent, setTextContent] = useState(item.content || "");
    const [titleContent, setTitleContent] = useState(item.title || "");
    const [linkContent, setlinkContent] = useState(item.link || "");

    const handleTitleChange = (event) => {
      setTitleContent(event.target.value);
    };

    const handlelinkChange = (event) => {
      setlinkContent(event.target.value);
    };

    const handleTextChange = (value) => {
      setTextContent(value);
    };

    const handleChangesDone = () => {
      const newItems = [...newsItems];
      newItems[index] = {
        ...item,
        content: textContent,
        title: titleContent,
        link: linkContent,
        isdone: true,
      };
      setnewsItems(newItems);
    };

    return (
      <>
        {item.isdone ? (
          <>
            <a href={item.link}>
              <div className="title">{item.title}</div>
            </a>
            <div
              className="ql-editor"
              style={{
                height: "auto",
                marginBottom: "15px",
                fontSize: "1.5vw",
                padding: "0",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: textContent }} />
            </div>
            <a
              href={item.link}
              target="_self"
              rel="noopener noreferrer"
              className="link"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Read More...
            </a>
          </>
        ) : (
          <>
            <input
              type="text"
              className="InputField"
              value={titleContent}
              onChange={(e) => handleTitleChange(e)}
            />
            <div className="textContainer" key={index}>
              <ReactQuill
                value={textContent}
                onChange={handleTextChange}
                modules={modules}
                // placeholder="Type your Text Here.."
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleChangesDone} style={{ width: "12%" }}>
                Done
              </button>
              <div style={{ display: "flex", width: "35%" }}>
                <p style={{ fontWeight: "bold" }}> Link : </p>
                <input
                  type="text"
                  className="InputField"
                  style={{
                    width: "78%",
                    fontSize: "initial",
                    fontWeight: "normal",
                    marginLeft: "3%",
                  }}
                  value={linkContent}
                  onChange={(e) => handlelinkChange(e)}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  const handleTextEdit = (item, index) => {
    const newItems = [...newsItems];
    newItems[index] = { ...item, isdone: false };
    setnewsItems(newItems);
  };

  const handledelete = (item, index) => {
    const newItems = [...newsItems];
    const before = newItems.slice(0, index);
    const after = newItems.slice(index + 1);
    setnewsItems([...before, ...after]);
  };

  return (
    <>
      <div className="container_news">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
          <div className="Heading">News</div>
          <Button
            variant="contained"
            sx={{ width: "10vw", mb: "1%", mt: "1%", fontSize: "1vw" }}
            className="PublishNews"
          >
            Publish
          </Button>
        </div>
        {newsItems.map((item, index) => (
          <div
            className="news"
            key={index}
            onMouseEnter={() => handlestateChange("editText", true, index)}
            onMouseLeave={() => handlestateChange("editText", false, index)}
          >
            <input
              id={`TakeimageInput_${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handlechangeImage(e, index, item)}
              multiple
              style={{ display: "none" }}
            />
            <div
              className="ImageContainer"
              onMouseEnter={() => handlestateChange("editImage", true, index)}
              onMouseLeave={() => handlestateChange("editImage", false, index)}
            >
              <img
                src={item.image}
                alt="Newsimage"
                className={
                  editStates[index].editImage ? "HoveredNewsImage" : "NewsImage"
                }
              />
              {editStates[index].editImage && (
                <div
                  className="edit-icon"
                  onClick={() =>
                    document.getElementById(`TakeimageInput_${index}`).click()
                  }
                >
                  <AddPhotoAlternateIcon color="black" />
                </div>
              )}
            </div>
            <div className="NewsContent">
              <DisplayText item={item} index={index} />
              {editStates[index].editText && item.isdone && (
                <>
                  <div
                    className="edit_content"
                    onClick={() => handleTextEdit(item, index)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                  </div>
                  <div
                    className="delete_content"
                    onClick={() => handledelete(item, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="xl" />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default NewsPage;
