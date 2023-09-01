import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            user_employeeID, 
            user_lastName, 
            user_firstName, 
            user_contactNumber, 
            user_email, 
            user_password, 
            user_position, 
            user_section,
            user_grade,
            user_accountStatus,
            user_accountCreationDate
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new user({
            user_employeeID, 
            user_lastName, 
            user_firstName, 
            user_contactNumber, 
            user_email, 
            user_password: passwordHash,  
            user_position, 
            user_section,
            user_grade,
            user_accountStatus,
            user_accountCreationDate
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};