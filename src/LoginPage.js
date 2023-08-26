import React, {useState} from 'react';
import { Paper, Grid, TextField, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';


import schoolLogo from './Data/DonjuanTransparent.png';
import clinicLogo from './Data/medical.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = () => {

    if (email === 'admin@example.com' && password === '1234') {
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }else{
      setShowWarning(true);
    }
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left-side Image */}
      <Grid item xs={12} sm={4} md={7} sx={{ display: isSmallScreen ? 'none' : 'block', backgroundColor: '#6C63FF', minHeight: '100vh' }}>
          <div className="flex justify-center items-center h-full">
            <img src={clinicLogo} alt="Clinic Logo" style={{ width: '600px', height: '430px' }} />
        </div>
          </Grid>

      {/* Right-side Login Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: isSmallScreen ? 'transparent' : '#FFF' }}>
          <Grid item xs={10} sm={8} md={6}>
            {/* Add form components here */}
            <div className="flex flex-col space-y-4 text-center">
              <div className="flex justify-center">
                <img src={schoolLogo} alt="School Logo" style={{ width: '100px', height: '100px' }} />
              </div>
              <h1 className="text-lg font-semibold">Don Juan Dela Cruz Central Elementary School</h1>
              <div className="flex items-start">
                <h2 className="text-4xl font-bold">Login</h2>
              </div>
              <TextField label="Email" fullWidth margin="normal" value = {email} onChange={(e) => setEmail(e.target.value)} />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle password visibility */}
                      {showPassword ? (
                        <VisibilityOff onClick={handleShowPasswordClick} style={{ cursor: 'pointer' }} />
                      ) : (
                        <Visibility onClick={handleShowPasswordClick} style={{ cursor: 'pointer' }} />
                      )}
                    </InputAdornment>
                  ),
                }}/>
           
              <div className="flex justify-between w-full">
                <div>
                  <input type="checkbox" />
                  <label className="ml-2">Remember me</label>
                </div>
                <a href="#forgot-password">Forgot password?</a>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="contained" style={{ width: '150px', height: '50px', borderRadius: '10px', backgroundColor: '#020826' }} onClick={handleLogin}>
                  Login
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <span style={{ color: '#707070' }}>Don’t have an account?</span>{' '}
                <Link to="/register" className="font-semibold">
                  Sign up here
                </Link>
              </div>
            </div>
          </Grid>
        </Grid>
      <Dialog open={showWarning} onClose={handleCloseWarning}>
        <DialogTitle>Invalid Credentials</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The entered email or password is incorrect. Please try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LoginPage;
