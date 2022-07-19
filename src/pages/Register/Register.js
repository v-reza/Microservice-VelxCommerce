import React, { useContext, useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../../context/UserContext";
import Toast from "../../custom/Toast/Toast";
import axios from "axios";
import loginCall from "../../context/LoginCall";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Register = () => {
  const email = useRef();
  const password = useRef();
  const fullname = useRef();
  const navigate = useNavigate()

  const { isFetching, error, user, dispatch } = useContext(AuthContext);
  const [isError, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios
      .post("/auth/register", {
        email: email.current.value,
        password: password.current.value,
        name: fullname.current.value,
      })
      .then((res) => {
        setError(false);
        loginCall(
          {
            email: email.current.value,
            password: password.current.value,
          },
          dispatch
        );
      })
      .catch((err) => {
        setError(true);
        setMessage(err.response.data);
      });
  };

  useEffect(() => {
    if (error) {
      setError(true);
      setMessage("User Already Exist");
    }
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  autoComplete="family-name"
                  inputRef={fullname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputRef={password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isFetching}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item style={{ cursor:"pointer" }}>
                <Link onClick={() => navigate("/login")} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Toast
        open={isError}
        message={message}
        variant="error"
        setOpen={setError}
      />
    </ThemeProvider>
  );
};

export default Register;
