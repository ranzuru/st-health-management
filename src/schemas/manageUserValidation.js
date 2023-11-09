import * as Yup from "yup";

export const validationSchema = (isEditing) =>
  Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    // Make phoneNumber and email completely optional when isEditing is true
    phoneNumber: isEditing
      ? Yup.string().nullable()
      : Yup.string()
          .required("Phone Number is required")
          .min(10, "Your phone number must be 10 digits"),
    email: isEditing
      ? Yup.string().email("Invalid email").nullable()
      : Yup.string()
          .email("Invalid email")
          .required("Email is required")
          .matches(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
            "Invalid email format"
          ),
    // Make password and confirmPassword completely optional when isEditing is true
    password: isEditing
      ? Yup.string().nullable()
      : Yup.string()
          .required("Password is required")
          .min(6, "must be at least 6 characters"),
    confirmPassword: isEditing
      ? Yup.string()
          .nullable()
          .when("password", {
            is: (password) => password?.length > 0,
            then: Yup.string().oneOf(
              [Yup.ref("password"), null],
              "Passwords must match"
            ),
          })
      : Yup.string()
          .required("Confirm Password is required")
          .oneOf([Yup.ref("password"), null], "Passwords must match"),
    gender: Yup.string().required("Gender is required"),
    role: Yup.string().required("Role is required"),
  });
