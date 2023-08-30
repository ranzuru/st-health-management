// src/RegistrationPage.js

import React, { useState } from 'react';
import { Paper, Grid, TextField, Button, InputAdornment, Select, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import clinicLogo from './Data/medical.png';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const RegistrationPage = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');

  const handlePhoneNumberChange = (event) => {
    const formattedPhoneNumber = event.target.value.replace(/\D/g, '');
    setPhoneNumber(formattedPhoneNumber);

    const phoneNumberLimited = formattedPhoneNumber.slice(0, 10);
    setPhoneNumber(phoneNumberLimited);
  
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left-side Image */}
      <Grid item xs={false} sm={4} md={7} sx={{ display: isSmallScreen ? 'none' : 'block', backgroundColor: '#6C63FF', minHeight: '100vh' }}>
        <div className="flex justify-center items-center h-full">
          <img src={clinicLogo} alt="Clinic Logo" style={{ width: '600px', height: '430px' }} />
        </div>
      </Grid>

      {/* Right-side Registration Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={
        { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: isSmallScreen ? 'transparent' : '#FFF' }}>
        <div className="flex justify-center items-center h-full">
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
             {/* Add new Grid item for "Create an account" */}
             <Grid item xs={12}>
              <div className="flex justify-center mb-6">
                <h2 className='text-4xl font-bold'>Create an account</h2>
              </div>
            </Grid>
            {/* Separate First Name and Last Name */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
                <TextField label="First Name" fullWidth margin="normal" sx={{ width: '270px', margin: '0 15px' }} />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
                <TextField label="Last Name" fullWidth margin="normal" sx={{ width: '270px', margin: '0 15px' }} />
              </Grid>
            {/* Continue with the rest of the form */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+63</InputAdornment>,
                  placeholder: '995 215 5436',
                }}
                sx={{ width: '270px', margin: '0 15px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField label="Email" fullWidth margin="normal" sx={{ width: '270px', margin: '0 15px' }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
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
                }}
                sx={{ width: '270px', margin: '0 15px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle confirm password visibility */}
                      {showConfirmPassword ? (
                        <VisibilityOff onClick={handleShowConfirmPasswordClick} style={{ cursor: 'pointer' }} />
                      ) : (
                        <Visibility onClick={handleShowConfirmPasswordClick} style={{ cursor: 'pointer' }} />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '270px', margin: '0 15px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <Select
                label="Gender"
                fullWidth
                margin="normal"
                value={gender}
                onChange={handleGender}
                displayEmpty
                inputProps={{ 'aria-label': 'Select your role' }}
                sx={{ width: '270px', margin: '0 15px' }}
              >
                <MenuItem value="" disabled>
                  Select your gender
                </MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <Select
                label="Role"
                fullWidth
                margin="normal"
                value={role}
                onChange={handleRoleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select your role' }}
                sx={{ width: '270px', margin: '0 15px' }}
              >
                <MenuItem value="" disabled>
                  Select your role
                </MenuItem>
                <MenuItem value="teacher">Nurse</MenuItem>
                <MenuItem value="student">District Nurse</MenuItem>
                <MenuItem value="parent">Teacher</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
            <div className="flex justify-center mt-4">
              <Button variant="contained" fullWidth style={{ width: '150px', height: '50px', marginTop: '20px', borderRadius: '10px', backgroundColor: '#020826' }}>
                Register
              </Button>
            </div>
            </Grid>
            <div className="flex justify-center mt-2">
              <span style={{ color: '#707070' }}>Already have an account?</span>{' '}
              <Link to="/" className="font-semibold">
                Login here
              </Link>
            </div>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default RegistrationPage;
