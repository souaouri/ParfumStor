
import {request, response} from "express";
import bcrypt from 'bcrypt';

import { getUserEmail } from "../models/user"
import { getUserPassword } from "../models/user"

export const Login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body as {email: string, password: string};

        if (!email || !password)
        {
            return res.status(400).json({message: 'Email or password are required'});
        }
        const userEmail = await getUserEmail(email);
        if (!userEmail)
        {
            return res.status(401).json({message: 'Invalid email'});
        }
        const userPassword = await getUserPassword(email);
        if (!userPassword)
        {
            return res.status(401).json({message: 'Invalid email or password'});
        }
        
        // Compare the provided password with the hashed password from database
        const isPasswordValid = await bcrypt.compare(password, userPassword);
        if (!isPasswordValid)
        {
            return res.status(401).json({message: 'Invalid password'});
        }
        
        return res.status(200).json({message: 'Login successful'});
    }
}

export const Logout = (req: Request, res: Response) => {
    // In a real application, you would handle token invalidation or session destruction here
    return res.status(200).json({message: 'Logout successful'});
}

export const Register = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword } = req.body as { email: string, password: string, confirmPassword: string};
        