import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { CircularProgress, Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../components/Header'

const defaultTheme = createTheme();

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const [ data, setData ] = useState({
        name:"",
        email:"",
        password:"",
    })
    const registerUser = async(e) =>{
        e.preventDefault();
        setLoading(true);
        const {name, email, password} = data;
        try {
          const {data} = await axios.post('/register', {
            name, email, password
          })

          if(data.error){
            toast.error(data.error);
            setLoading(false);
          }else{
            setData({});
            setLoading(false);
            toast.success('Account Registered');
            navigate('/login')
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
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
            Register you store
          </Typography>
          <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              type='text' placeholder='Store Name' value={data.name}
              onChange={(e)=>{setData({...data, name:e.target.value})}}
            />
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
                (loading)?(<CircularProgress size="1.6rem" color='inherit'/>):"Register"
              }
            </Button>
            <Grid container>
              <Grid item>
                <Link to='/login' variant="body2">
                  {"Already have an account? Log in"}
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

export default Register
