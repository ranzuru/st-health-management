import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSnackbar from "../components/CustomSnackbar";
import axiosInstance from "../config/axios-instance";
import FormHelperText from "@mui/material/FormHelperText";
import EditIcon from "@mui/icons-material/Edit";
import { validationSchema } from "../schemas/manageUserValidation";
import FormInput from "../components/userComponents/FormInput";
import {
  PhoneNumberField,
  PasswordField,
  EmailField,
} from "../components/userComponents/CustomInput";

const AddUserDialog = (props) => {
  const {
    open = false,
    onClose,
    initialData,
    selectedUser,
    isEditing,
    onUpdate,
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });
  const currentValidationSchema = validationSchema(isEditing);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentValidationSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      role: "",
    },
  });

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCreateUser = async (data) => {
    try {
      await axiosInstance.post("/auth/internalRegister", data);
      showSnackbar("Successfully created an account", "success");
      handleClose();
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleUpdateUser = async (formData) => {
    if (isEditing) {
      const { email, phoneNumber, password, ...dataToUpdate } = formData;
      try {
        const response = await axiosInstance.put(
          `/users/updateUser/${selectedUser._id}`,
          dataToUpdate
        );
        showSnackbar("User updated successfully", "success");
        onUpdate(response.data);
        handleClose();
      } catch (error) {
        console.log("Update Error:", error);
        handleRequestError(error);
      }
    }
  };

  const handleSaveOrUpdate = (data) => {
    if (isEditing) {
      handleUpdateUser(data);
    } else {
      handleCreateUser(data);
    }
  };

  const handleRequestError = (error) => {
    let errorMessage = "An error occurred during the request";
    if (error.response) {
      errorMessage = error.response.data.error || errorMessage;
      if (error.response.status === 400 && !isEditing) {
        setEmailExists(true);
      }
    }
    showSnackbar(errorMessage, "error");
  };

  const handleClose = () => {
    reset();
    onClose();
    setEmailExists(false);
  };

  useEffect(() => {
    if (selectedUser && isEditing) {
      setValue("lastName", selectedUser.lastName || "");
      setValue("firstName", selectedUser.firstName || "");
      setValue("gender", selectedUser.gender || "");
      setValue("role", selectedUser.role || "");
    }
  }, [selectedUser, isEditing, setValue]);

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={handleSubmit(handleSaveOrUpdate)}>
          <DialogContent>
            <DialogContentText>
              Please fill in the user details.
            </DialogContentText>
            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              error={errors.firstName}
            />
            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              error={errors.lastName}
            />
            {!isEditing && (
              <>
                <PhoneNumberField control={control} errors={errors} />
                <EmailField control={control} errors={errors || emailExists} />
                <PasswordField
                  name="password"
                  control={control}
                  errors={errors}
                  showPassword={showPassword}
                  handleShowPasswordClick={handleShowPasswordClick}
                />
                <PasswordField
                  name="confirmPassword"
                  control={control}
                  errors={errors}
                  showPassword={showConfirmPassword}
                  handleShowPasswordClick={handleShowConfirmPasswordClick}
                />
              </>
            )}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl required fullWidth margin="normal">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select labelId="gender-label" label="Gender" {...field}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  <FormHelperText error={!!errors.gender}>
                    {errors.gender?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl required fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select labelId="role-label" label="Role" {...field}>
                  <MenuItem value="Principal">
                                Principal
                              </MenuItem>
                              <MenuItem value="Administrator">
                                Administrator
                              </MenuItem>
                              <MenuItem value="Office Staff">
                                Office Staff
                              </MenuItem>
                              <MenuItem value="IT Staff">
                                IT Staff
                              </MenuItem>
                              <MenuItem value="Doctor">
                                Doctor
                              </MenuItem>
                              <MenuItem value="District Nurse">
                                District Nurse
                              </MenuItem>
                              <MenuItem value="School Nurse">
                                School Nurse
                              </MenuItem>
                              <MenuItem value="Feeding Program Head">
                                Feeding Program Head
                              </MenuItem>
                              <MenuItem value="Medical Program Head">
                                Medical Program Head
                              </MenuItem>
                              <MenuItem value="Dengue Program Head">
                                Dengue Program Head
                              </MenuItem>
                              <MenuItem value="Deworming Program Head">
                                De-worming Program Head
                              </MenuItem>
                              <MenuItem value="Intern">
                                Intern
                              </MenuItem>
                  </Select>
                  <FormHelperText error={!!errors.role}>
                    {errors.role?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                isEditing ? <EditIcon /> : <PersonAddAltOutlinedIcon />
              }
            >
              {isEditing ? "Update User" : "Add User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
