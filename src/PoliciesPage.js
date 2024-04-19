import React, { useState, useEffect } from "react";
import "./PoliciesPage.css";
import Button from "@mui/material/Button";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteModel } from "mongoose";
export default function PoliciesPage() {
  const Navigate = useNavigate();
  const [policyItems, setPolicyItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [delteModal, setdeleteModal] = useState(false);
  const [newPolicyTitle, setNewPolicyTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [openStates, setopenStates] = useState({});

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

  const fetchedArray = [
    {
      PolicyTitle: "Email Creation Policy",
      PdfLink:
        "https://webdev.iiit.ac.in/WordPress/it-services/wp-content/uploads/2023/12/Email_Creation_policy-V1.pdf",
    },
    {
      PolicyTitle: "Password Creation Policy",
      PdfLink: "#",
    },
  ];

  async function fetchFields() {
    try {
      const response = await fetch(`/fields`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch page data");
      }
      const pageData = await response.json();
      setPolicyItems(pageData.fields);
      console.log(pageData.fields);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchFields();
  }, []);

  const handleVersioning = (id) => {
    console.log(id);
  };

  const handleAddNew = () => {
    setOpenModal(true);
  };

  const handleAddPolicy = async () => {
    const formData = new FormData();
    const temp = {
      Name: newPolicyTitle,
      isNewField: "true",
    };
    formData.append("Info", JSON.stringify(temp));
    formData.append("file", pdfFile);
    try {
      const response = await fetch("/add-and-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal();
  };

  const handledeleteField = async (index) => {
    console.log(index);
    const data = {
      index: index,
    };

    try {
      const response = await fetch(`/delete-field`, {
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
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewPolicyTitle("");
    setPdfFile(null);
  };

  const handleTitleChange = (event) => {
    setNewPolicyTitle(event.target.value);
  };

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleFileChangeUploadOnly = async (event, index) => {
    try {
      console.log(index);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const response = await fetch(`/upload/${index}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="PoliciesMain">
        {policyItems.map((item, index) => (
          <div
            style={{
              display: "flex",
              // justifyContent: "center",
              alignItems: "center",
              gap: "1.3vw",
              marginRight: "1%",
            }}
          >
            <input
              id={`TakeimageInput_${index}`}
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChangeUploadOnly(e, item._id)}
              style={{ display: "none" }}
            />
            <div key={index} className="PoliciesContainer">
              {/* <a
                href={item.PdfLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
              > */}
              <div
                className="AlignPolicies"
                style={{ cursor: "pointer" }}
                onClick={() => Navigate(`/display-pdf/${item._id}`)}
              >
                <LinkIcon sx={{ color: "#090e9d", fontSize: "2.5vw" }} />
                <div style={{ fontSize: "1.5vw" }}>{item.Name}</div>
              </div>
              {/* </a> */}
              <div className="AlignPolicies">
                <Button
                  // variant="contained"
                  sx={{
                    width: "10vw",
                    fontSize: "1vw",
                    color: "#7b79f1",
                    // backgroundColor: "#7b79f1",
                  }}
                  onClick={() =>
                    document.getElementById(`TakeimageInput_${index}`).click()
                  }
                >
                  Upload
                </Button>
                <Button
                  // variant="contained"
                  sx={{
                    width: "12vw",
                    fontSize: "1vw",
                    color: "#7b79f1",
                  }}
                  onClick={() => handleVersioning(item._id)}
                >
                  View Changes
                </Button>
              </div>
            </div>
            <DeleteIcon
              sx={{ fontSize: "2.5vw", cursor: "pointer" }}
              onClick={() => handleOpen(index)}
            />
            <Modal open={openStates[index]} onClose={() => handleClose(index)}>
              <Box
                sx={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  position: "fixed", // Change position to fixed
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  maxWidth: "80%", // Adjust width to fit within viewport
                  maxHeight: "80%", // Adjust height to fit within viewport
                  overflowY: "auto", // Enable vertical scrolling if needed
                }}
              >
                <Typography variant="h6" component="h2">
                  Are you sure you want to delete field "{item.Name}"
                </Typography>
                <Button
                  onClick={() => handledeleteField(item._id)}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  OK
                </Button>
              </Box>
            </Modal>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "12vw",
              mt: "1.5vh",
              fontSize: "1vw",
            }}
            onClick={handleAddNew}
          >
            Add New
          </Button>
        </div>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed", // Change position to fixed
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "80%", // Adjust width to fit within viewport
            maxHeight: "80%", // Adjust height to fit within viewport
            overflowY: "auto", // Enable vertical scrolling if needed
          }}
        >
          <Typography variant="h6" component="h2">
            Add New Policy
          </Typography>
          <TextField
            label="Policy Title"
            variant="outlined"
            value={newPolicyTitle}
            onChange={handleTitleChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            sx={{ mt: 2 }}
          />
          <Button onClick={handleAddPolicy} variant="contained" sx={{ mt: 2 }}>
            Add Policy
          </Button>
        </Box>
      </Modal>
    </>
  );
}
