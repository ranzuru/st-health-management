const {
  studentValidationSchema,
} = require("../schema/studentValidationSchema");
const validateStudent = (req, res, next) => {
  const { error } = studentValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validateStudent;
