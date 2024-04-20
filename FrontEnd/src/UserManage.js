import React, { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Cross from "./cross.png";
import Upgrade from "./upgrade.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

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

export default function ManageUsersPage() {
  const [displayAdmins, setDisplayAdmins] = useState([]);
  const [fetchedAdmins, setFetchedAdmins] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("test@123");
  const [userRole, setUserRole] = useState("Admin");
  const [userNameError, setUserNameError] = useState(false);
  const [userEmailError, setUserEmailError] = useState(false);
  const [userPassError, setUserPassError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setUserNameError(value.trim() === "");
    checkFormValidity();
  };

  const handleUserEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
    setUserEmailError(value.trim() === "");
    checkFormValidity();
  };

  const handleUserPassChange = (e) => {
    const value = e.target.value;
    setUserPass(value);
    setUserPassError(value.trim() === "");
    checkFormValidity();
  };

  const handleUserRoleChange = (e) => {
    setUserRole(e.target.value);
    checkFormValidity();
  };

  const checkFormValidity = () => {
    if (
      userName.trim() !== "" &&
      userEmail.trim() !== "" &&
      userPass.trim() !== "" &&
      userRole !== ""
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  // Not closing immediatelty after clicking Submit
  const handleSubmit = async () => {
    setUserName("");
    setUserEmail("");
    setUserPass("test@123");
    setUserRole("Admin");
    setSubmitDisabled(true);
    setUserEmailError(false);
    setUserEmailError(false);
    setUserPassError(false);
    window.location.reload();
    setOpen(false);
    const data = {
      name: userName,
      email: userEmail,
      role: userRole,
      password: userPass
    }

    try {
      const response = await fetch(`/api/add-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else{
        const responseData = await response.json();
        if(responseData.error == ''){
          console.log("hi"); // Test it 
        } else {
          console.log(responseData.error);
        }
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/admins');
        const data = await response.json();
        setDisplayAdmins(data);
        setFetchedAdmins(data);
      } catch (error) {
        console.error('Failed to fetch Admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleSearch = (searchText) => {
    if (searchText === "") {
      setDisplayAdmins(fetchedAdmins);
      return;
    }
    let searchedArray = [];
    for (let i = 0; i < fetchedAdmins.length; i++) {
      if (
        fetchedAdmins[i].name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        fetchedAdmins[i].email.toLowerCase().includes(searchText.toLowerCase())
      ) {
        searchedArray.push(fetchedAdmins[i]);
      }
    }
    console.log(searchText);
    setDisplayAdmins(searchedArray);
  };

  const handleRemove = async ({ id }) => {
    let index = -1;
    for (let i = 0; i < displayAdmins.length; i = i + 1) {
      if (displayAdmins[i]._id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      console.log("No matching id in the Admins List to Remove");
      return;
    }

    const data = {
      id: id,
    };
    let newAdmins = [...displayAdmins];
    newAdmins.splice(index, 1);
    setDisplayAdmins(newAdmins);
    try {
      const response = await fetch(`/api/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      if(responseData.error != '')
      {
        console.log(responseData.error);
      }
      window.location.reload();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const handleUpgrade = async ({ id }) => {
    let index = -1;
    for (let i = 0; i < displayAdmins.length; i = i + 1) {
      if (displayAdmins[i]._id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      console.log("No matching id in the Admins List to Upgrade");
      return;
    }
    let newAdmins = [...displayAdmins];
    newAdmins[index].role = "Super Admin";
    setDisplayAdmins(newAdmins);
    const data = {
      id: id,
    };
    try {
      const response = await fetch(`/api/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      if(responseData.error != '')
      {
        console.log(responseData.error);
      }
      window.location.reload();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  return (
    <div className="body">
      <div className="SearchContainer">
        <div className="SearchBarContainer">
          <input
            type="text"
            placeholder="Search"
            className="SearchBar"
            onChange={(e) => handleSearch(e.target.value)}
          ></input>
          <div className="SearchIcon">
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
          </div>
        </div>
        <div>
          <button className="AddUser" onClick={handleOpen}>
            Add New User
          </button>
        </div>
      </div>
      <table className="Table">
        <tr className="Row">
          <th style={{ width: "23vw" }}>Name</th>
          <th style={{ width: "38vw" }}>Email</th>
          <th style={{ width: "17vw" }}>Role</th>
          <th style={{ width: "16vw" }}>Options</th>
        </tr>
        {displayAdmins.map((admin, index) => (
          <tr className="Row" key={index}>
            <td style={{ width: "23vw" }}>{admin.name}</td>
            <td style={{ width: "38vw" }}>{admin.email}</td>
            <td style={{ width: "17vw" }}>{admin.role}</td>
            <td style={{ width: "16vw" }}>
              <div className="Options">
                {admin.role === "Admin" && (
                  <img
                    src={Upgrade}
                    style={{
                      width: "3vh",
                      paddingRight: "2.5vh",
                      cursor: "pointer",
                    }}
                    alt="upgrade"
                    onClick={() => handleUpgrade({ id: admin._id })}
                  ></img>
                )}
                <img
                  src={Cross}
                  style={{ width: "2.5vh", cursor: "pointer" }}
                  alt="cross"
                  onClick={() => handleRemove({ id: admin._id })}
                ></img>
              </div>
            </td>
          </tr>
        ))}
      </table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6">Details of User :</Typography>
          <div className="InputOptions">
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              sx={{ mt: 1, width: "70%" }}
              value={userName}
              onChange={handleUserNameChange}
              error={userNameError}
              helperText={userNameError && "Name is required"}
            />
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              sx={{ mt: 1, width: "70%" }}
              value={userEmail}
              onChange={handleUserEmailChange}
              error={userEmailError}
              helperText={userEmailError && "Email is required"}
            />
            <FormControl sx={{ mt: 1, width: "60%" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                value={userPass}
                onChange={handleUserPassChange}
                error={userPassError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {userPassError && <div>Password is required</div>}
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={userRole}
                onChange={handleUserRoleChange}
                error={!userRole}
                displayEmpty
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
              </Select>
              {!userRole && <div>Role is required</div>}
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "10vw", mt: 5 }}
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
