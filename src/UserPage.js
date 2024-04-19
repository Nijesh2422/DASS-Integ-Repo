import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";
import plus from "./images/SquarePlus.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faEye,
  faCaretRight,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Navbar from "./Navbar2.js";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 150,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
};

// import "bootstrap/dist/css/bootstrap.min.css";

async function fetchPageData(index) {
  try {
    const response = await fetch(`/api/pages/${index.index}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch page data");
    }
    const pageData = await response.json();
    // console.log(pageData);
    return pageData; // Return the fetched page data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or a sensible default in case of error
  }
}

async function handleAddNewClick(index, mainpage, title, navigate) {
  const data = {
    title: title,
    index: index,
    mainpage: mainpage,
  };
  console.log(index);
  try {
    const response = await fetch(`/api/add-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();

    if (response.ok) {
      if (responseData.newindex !== -1) {
        navigate("/add-new", { state: { responseData } });
      } else {
        alert("A page with the same name already exists.");
      }
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}

async function handleDeleteClick(index) {
  const data = {
    index: index,
  };

  try {
    const response = await fetch(`/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    window.location.reload(); // This will reload the page
    // console.log(responseData);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}

const handleAddButtonClick = (index, mainpage, negivate) => {
  const newPageName = prompt("Please enter the name of the new page:");
  if (newPageName) {
    // Assuming you have index, mainpage defined somewhere
    handleAddNewClick(index, mainpage, newPageName, negivate);
  }
};

function WordComponent({ pages, index}) {
  const negivate = useNavigate();
  // const [newPageTitle, setNewPageTitle] = useState('');
  const [dropdownStates, setDropdownStates] = useState({});
  const [openStates, setopenStates] = useState({});
  const [rotationDegrees, setRotationDegrees] = useState({});
  const [subPages, setsubPages] = useState({}); // Start with null or an empty array
  // console.log(pages);
  if (!Array.isArray(pages)) {
    if (Array.isArray(pages[index])) {
      pages = pages[index];
    } else {
      // console.error('Expected pages to be an array but received:', pages);
      return;
    }
  }
  const toggleDropdown = (index) => {
    setDropdownStates({
      ...dropdownStates,
      [index]: !dropdownStates[index],
    });
  };
  const handleOpen = (index) => {
    setopenStates({
      ...openStates,
      [index]: true,
    });
  };
  const handleClose = (index) => {
    setopenStates({
      ...openStates,
      [index]: false,
    });
  };

  const toggleRotation = (index) => {
    setRotationDegrees({
      ...rotationDegrees,
      [index]: rotationDegrees[index] ? 0 : 90,
    });
  };
  const handleViewClick = (index, negivate) => {
    negivate(`/display-publish/${index}`);
  };

  const handleEditClick = (index, negivate) => {
    negivate(`/display-save/${index}`);
  };

  const handleDeleteButtonClick = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item and all its contents"
    );
    if (isConfirmed) {
      // Assuming you have a function to handle the actual deletion
      handleDeleteClick(index);
    }
  };

  return (
    <>
      <div className="column">
        {pages.map((page) => (
          <>
            <div className="pageBox" key={page.index}>
              <div
                className="optionButton"
                onClick={async () => {
                  toggleDropdown(page.index);
                  toggleRotation(page.index);
                  setsubPages({
                    ...subPages,
                    [page.index]: await fetchPageData({ index: page.index }),
                  });
                  // console.log(subPages);
                  // setsubPages(await fetchPageData({index: page.index}));
                }}
              >
                <p>
                  <FontAwesomeIcon
                    style={{
                      transform: `rotate(${
                        rotationDegrees[page.index] || 0
                      }deg)`,
                      fontSize: "86%",
                    }}
                    icon={faCaretRight}
                  />
                </p>
              </div>
              <div className="pageName">
                <p>{page.title}</p>
              </div>
              <div className="options">
                <div className="optionButton">
                  <p>
                    <FontAwesomeIcon
                      icon={faEye}
                      style={{ fontSize: "66%" }}
                      onClick={() => handleViewClick(page.index, negivate)}
                    />
                  </p>
                </div>
                <div className="optionButton">
                  <p>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ fontSize: "66%" }}
                      onClick={() => handleEditClick(page.index, negivate)}
                    />
                  </p>
                </div>
                <div className="optionButton">
                  <p>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      style={{ fontSize: "66%" }}
                      onClick={() => handleDeleteButtonClick(page.index)}
                    />
                  </p>
                </div>
                <div className="optionButton">
                  <p>
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      style={{ fontSize: "66%" }}
                      onClick={()=>handleOpen(page.index)}
                      // onClick={() =>
                      //   handleAddButtonClick(page.index, false, negivate)
                      // }
                    />
                  </p>
                </div>
              </div>
            </div>
            {dropdownStates[page.index] && subPages && (
              <div className="subPages">
                <WordComponent
                  pages={subPages}
                  index={page.index}
                />
              </div>
            )}
            <HandleModal
              Open={openStates[page.index]}
              handleClose={handleClose}
              index={page.index}
              mainpage={false}
              navigate={negivate}
            />
          </>
        ))}
      </div>
    </>
  );
}

function HandleModal({ Open, handleClose, index, mainpage, navigate }) {
  const [name, setName] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <Modal
        open={Open}
        onClose={()=>handleClose(index)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Enter the name of the new page
          </Typography>
          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            sx={{ width: "60%" }}
            value={name}
            onChange={handleNameChange}
            // on
          />
          <Button
            variant="contained"
            sx={{ width: "10vw", marginTop: "3%" }}
            onClick={() => handleAddNewClick(index, mainpage, name, navigate)}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default function AdminConfigPage() {
  const [mainPages, setMainPages] = useState(null); // Start with null or an empty array
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Assuming fetchPages is an async function that fetches your pages
    const fetchPages = async () => {
      try {
        const response = await fetch("/api/main-pages");
        const data = await response.json();
        setMainPages(data); // Set the fetched data to state
      } catch (error) {
        console.error("Failed to fetch main pages:", error);
      }
    };

    fetchPages();
  }, []); // The empty array means this effect runs once on mount

  return (
    <>
      <div style={{ background: "#F6F8F8", minHeight: "100vh" }}>
        {/* <Navigation /> */}
        <Navbar />
        <Typography
          variant="h5"
          noWrap
          sx={{
            mr: 2,
            display: { md: "flex" },
            fontFamily: "monospace",
            padding: "2%",
            fontWeight: 800,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Pages
        </Typography>
        <div style={{ paddingLeft: "9%", paddingRight: "9%" }}>
          <div className="container-user">
            <div className="content">
              {/* <ParentComponent /> */}
              {mainPages && (
                <WordComponent
                  pages={mainPages}
                  // Open={open}
                  // handleOpen={handleOpen}
                  // handleClose={handleClose}
                />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleOpen}
                style={{
                  fontSize: "large",
                  height: "1cm",
                  width: "4cm",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <img
                    src={plus}
                    alt="Plus"
                    style={{ width: "20%", height: "20%" }}
                  />
                  Add new
                </div>
              </button>
            </div>
          </div>
        </div>
        <HandleModal
          Open={open}
          handleClose={handleClose}
          index={0}
          mainpage={true}
          navigate={navigate}
        />
      </div>
    </>
  );
}
