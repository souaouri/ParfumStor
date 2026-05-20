
import type { Request, Response } from 'express';
// load bcryptjs at runtime if available; otherwise fallback to plaintext (dev only)
declare const require: any;
let bcrypt: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    bcrypt = require('bcryptjs');
} catch (err) {
    console.warn('bcryptjs not found — running without password hashing (plaintext fallback)');
}
import { getUserEmail, getUserPassword, createUser } from "../models/user"
import dotenv from 'dotenv';

dotenv.config();

export const Login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body as {email: string, password: string};

        if (!email || !password)
        {
            return res.status(400).json({message: 'Email or password are required'});
        }
        // If ADMIN_EMAIL and ADMIN_PASSWORD are set in env, only allow that admin to login
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@site.com';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

        if (email !== ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Access denied: admin only' });
        }

        // If an ADMIN_PASSWORD is provided in env, validate against it first (plaintext)
        if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
            return res.status(200).json({ message: 'Login successful', admin: true });
        }

        // Fallback: if admin account exists in DB, compare hashed password
        const userEmail = await getUserEmail(email);
        if (!userEmail) {
            return res.status(401).json({message: 'Invalid email'});
        }
        const userPassword = await getUserPassword(email);
        if (!userPassword) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isPasswordValid = bcrypt ? await bcrypt.compare(password, userPassword) : (password === userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid password'});
        }

        return res.status(200).json({message: 'Login successful', admin: true});
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const Logout = (req: Request, res: Response) => {
    // In a real application, you would handle token invalidation or session destruction here
    return res.status(200).json({message: 'Logout successful'});
}

export const Register = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword } = req.body as { email: string, password: string, confirmPassword: string};
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All the fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const existingEmail = await getUserEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash the password before storing it in the database
        const hashedPassword = bcrypt ? await bcrypt.hash(password, 10) : password;
        
        // Here you would insert the new user into the database with the hashed password
        await createUser(email, hashedPassword);
        
        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
