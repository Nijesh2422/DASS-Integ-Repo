import React, { useState } from "react";
import "./ResetPassword.css";
import KeyIcon from "@mui/icons-material/Key";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [userPass, setUserPass] = useState("");
  const [userCPass, setUserCPass] = useState("");


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const [showCPassword, setShowCPassword] = useState(false);

  const handleClickShowCPassword = () => setShowCPassword((show) => !show);
  const handleMouseDownCPassword = (e) => {
    e.preventDefault();
  };

  const handleUserPassChange = (e) => {
    const value = e.target.value;
    setUserPass(value);
    // setUserPassError(value.trim() === "");
    // checkFormValidity();
  };

  const handleUserCPassChange = (e) => {
    const value = e.target.value;
    setUserCPass(value);
    // setUserPassError(value.trim() === "");
    // checkFormValidity();
  };
  const handleReset = () => {
    
  }

  return (
    <div className="PasswordReset">
      <div className="Container">
        <div style={{ textAlign: "center" }}>
          <KeyIcon fontSize="large" sx={{ color: "#090e9d" }} />
          <p className="Password"> Set New Password </p>
          <FormControl sx={{ mt: 1, width: "70%" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              New Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              value={userPass}
              onChange={handleUserPassChange}
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
          <FormControl sx={{ mt: 1, width: "70%" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              Confirm New Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showCPassword ? "text" : "password"}
              value={userPass}
              onChange={handleUserPassChange}
              // error={userPassError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowCPassword}
                    onMouseDown={handleMouseDownCPassword}
                  >
                    {showCPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {/* {userPassError && <div>Password is required</div>} */}
          </FormControl>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#090e9d",
              mt: "6vh",
              width: "10vw",
              mb: "6vh",
            }}
            onClick={()=>handleReset()}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
