import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Header from '../components/Header';

const defaultTheme = createTheme();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const [ data, setData ] = useState({ 
        email:"",
        password:"",
    })
    
    const loginUser = async(e) =>{
      e.preventDefault();
        if(!data.email || !data.password){
          toast.error("Please fill all the details!");
        }else{
          setLoading(true);
        const {email, password} = data;
        try {
          const {data} = await axios.post('/login', {
            email, password
          })
          if(data.error){
            toast.error(data.error);
            setLoading(false);
          }else{
            setData({});
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/')
            window.location.reload();
            toast.success("Logged in")
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        } 
        }
    }
  return (
    <>
    <Header/>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log-In
          </Typography>
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              autoComplete="email"
              autoFocus
              type='email' placeholder='Email' value={data.email} onChange={(e)=>{setData({...data, email:e.target.value})}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type='password' placeholder='Password' value={data.password} onChange={(e)=>{setData({...data, password:e.target.value})}}
            />
            <Button
              type="submit"
              fullWidth
              size='large'
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {
                (loading)?(<CircularProgress size="1.6rem" color='inherit'/>):"Login"
              }
            </Button>
            <Grid container>
              <Grid item>
                <Link to='/register' variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </>
  )
}

export default Login
