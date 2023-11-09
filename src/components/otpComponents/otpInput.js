import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const OtpInput = ({
  onSubmit,
  onResendOtp,
  timeLeft,
  setTimeLeft,
  open,
  handleClose,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showResend, setShowResend] = useState(true);

  const handleResendClick = () => {
    onResendOtp();
    setTimeLeft(60);
    setOtp(new Array(6).fill(""));
    setShowResend(false); // Hide the button
  };

  const handleChange = (event, index) => {
    const value = event.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      );
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (newOtp.every((num) => num.trim() !== "") && newOtp.length === 6) {
      onSubmit(newOtp.join(""));
    }
  };

  const handleSubmit = () => {
    onSubmit(otp.join(""));
    setOtp(new Array(6).fill(""));
  };

  useEffect(() => {
    let timer;
    if (open && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((current) => current - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setShowResend(true); // Show resend button when timeLeft is 0
    }
    return () => clearInterval(timer); // Clean up the interval on unmount
  }, [open, timeLeft, setTimeLeft]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <div className="flex flex-col space-y-4 items-center">
          <div>Enter your one-time password</div>
          {timeLeft > 0 ? <div>Time left to enter OTP: {timeLeft}s</div> : null}
          <div className="flex space-x-2">
            {[...Array(6)].map((_, index) => (
              <TextField
                autoFocus={index === 0}
                key={index}
                value={otp[index]}
                variant="outlined"
                onChange={(event) => handleChange(event, index)}
                inputProps={{
                  maxLength: 1,
                  className: "text-center",
                  name: `otp-${index}`,
                }}
                sx={{
                  width: "3rem",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray",
                    },
                    "&:hover fieldset": {
                      borderColor: "blue",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "blue",
                    },
                  },
                }}
                className="w-12 h-14 border-2 border-gray-300 focus:border-blue-500 rounded"
              />
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
        {showResend && timeLeft <= 0 && (
          <Button onClick={handleResendClick} color="primary">
            Resend OTP
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OtpInput;
