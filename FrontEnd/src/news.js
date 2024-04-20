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
// import Footer from "./Footer.js";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
  const FetchNewsArray = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch page data");
      }
      const responseData = await response.json();
      setnewsItems(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    FetchNewsArray();
  }, []);

  const handlestateChange = (attribute, value, index, item ) => {
    const newStates = [...newsItems];
    newStates[index] = { ...item, [attribute]: value };
    setnewsItems(newStates);
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
  const [openModal, setOpenModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewsTitle("");
    setNewsContent("");
    setNewsImage(null);
    setNewsLink("");
  };

  const handleNewsTitleChange = (event) => {
    setNewsTitle(event.target.value);
  };

  const handleNewsContentChange = (event) => {
    setNewsContent(event.target.value);
  };

  const handleNewsImageChange = (event) => {
    const files = event.target.files; // Get the first file from the input
    setNewsImage(files);
  };

  const handleNewsLinkChange = (event) => {
    setNewsLink(event.target.value);
  };

  const handleModalSubmit = async () => {
    const newItems = [...newsItems];
    const files = newsImage; // Get the first file from the input
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const res = await uploadImageFunction(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const data = {
            title: newsTitle,
            content: newsContent,
            image: "../" + res.imagepath,
            isdone: true,
            link: newsLink,
            editImage: false,
            editText: false,
          };
          // newedits.push(edit);
          // newItems.push(data);
          setnewsItems([...newItems, data]);
        };
        reader.readAsDataURL(file);
      }
    }
    handleCloseModal();
    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   const imageData = e.target.result; // Base64 encoded image data
    //   setNewsImage(imageData); // Update the state with the image data
    // };

    // // Read the file as a data URL (base64 encoded)
    // reader.readAsDataURL(file);
  };


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

  const HandlePublish = async () => {
    try {
      const data = {
        items: newsItems,
      };
      const response = await fetch("/api/publish-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Published Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container_news">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="Heading">News</div>
          <div className="Add-Publish">
            <Button
              variant="contained"
              sx={{ width: "10vw", mb: "1%", mt: "1%", fontSize: "1vw" }}
              onClick={handleOpenModal}
            >
              Add News
            </Button>
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box sx={style}>
                <Typography variant="h6" component="h2">
                  Add News
                </Typography>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={newsTitle}
                  onChange={handleNewsTitleChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  value={newsContent}
                  onChange={handleNewsContentChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                />
                <input
                  type="file"
                  onChange={handleNewsImageChange}
                  style={{ marginTop: "2vh" }}
                />
                {/* <Input
                  type="file"
                  onChange={handleNewsImageChange}
                  fullWidth
                  sx={{
                    mt: 2,
                    '& input[type="file"]': {
                      borderBottom: 'none' // Remove the bottom border
                    }
                  }}
                /> */}
                <TextField
                  label="Link"
                  variant="outlined"
                  value={newsLink}
                  onChange={handleNewsLinkChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <Button
                  onClick={handleModalSubmit}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Modal>

            <Button
              variant="contained"
              sx={{ width: "10vw", mb: "1%", mt: "1%", fontSize: "1vw" }}
              className="PublishNews"
              onClick={() => HandlePublish()}
            >
              Publish
            </Button>
          </div>
        </div>
        {newsItems.map((item, index) => (
          <div
            className="news"
            key={index}
            onMouseEnter={() => handlestateChange("editText", true, index, item)}
            onMouseLeave={() => handlestateChange("editText", false, index, item)}
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
              onMouseEnter={() => handlestateChange("editImage", true, index, item)}
              onMouseLeave={() => handlestateChange("editImage", false, index, item)}
            >
              <img
                src={item.image}
                alt="Newsmage"
                className={
                  item.editImage ? "hovered_image" : "image"
                }
              />
              {item.editImage && (
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
              {item.editText && item.isdone && (
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
      {/* <Footer /> */}
    </>
  );
}

export default NewsPage;
