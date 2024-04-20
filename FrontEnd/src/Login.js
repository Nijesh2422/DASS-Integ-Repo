import React, { useState } from "react";
import "./Login.css";
// import videoBackground from "./LoginBackground.mp4";
import Logo from "./Black_logo.png";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "@mui/material/TextField";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = async() => {
    const data = {
      email: userEmail,
      password:userPass
    };
  
    try {
      const response = await fetch(`/api/login`, {
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
      if(responseData.role == 'Admin'){
        navigate(`/admin-config`);
      } else if (responseData.role == 'Super Admin'){
        navigate(`/user-manage`);
      } else if (responseData.role == 'Not Found'){

      }
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleUserEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
  };

  const handleUserPassChange = (e) => {
    const value = e.target.value;
    setUserPass(value);
  };

  return (
    <div className="login-page">
      {/* <video autoPlay loop muted className="video-background">
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div className="content-haha">
        <div className="Container">
          <div style={{ textAlign: "center" }}>
            <img src={Logo} alt="Logo" style={{ width: "23vh" }}></img>
            <div className="Line"></div>
            <div className="LoginTitle">
              <LockIcon fontSize="large" sx={{ color: "#090e9d" }} />
              <p style={{ fontWeight: "bold" }}>Login</p>
            </div>
            <div className="Input">
              <PersonIcon
                fontSize="large"
                sx={{ color: "black", marginTop: "25px" }}
              />
              <TextField
                id="standard-basic"
                label="Email / Username"
                variant="standard"
                sx={{ mt: 1, width: "70%" }}
                value={userEmail}
                onChange={(e)=>handleUserEmailChange(e)}
                // error={userEmailError}
                // helperText={userEmailError && "Email is required"}
              />
            </div>
            <div className="Input">
              <KeyIcon
                fontSize="large"
                sx={{ marginTop: "25px", color: "black" }}
              />
              <FormControl sx={{ mt: 1, width: "70%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={userPass}
                  onChange={(e)=>handleUserPassChange(e)}
                  // error={userPassError}
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
                {/* {userPassError && <div>Password is required</div>} */}
              </FormControl>
            </div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#090e9d",
                mt: "5vh",
                width: "10vw",
                mb: "6vh",
              }}
              onClick={()=>handleSubmit()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
