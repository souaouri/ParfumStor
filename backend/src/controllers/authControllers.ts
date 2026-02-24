
import {request, response} from "express";
import { getUserRow } from 

export const Login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body as {email: string, password: string};

        if (!email || !password)
        {
            return res.status(400).json({message: 'Email or password are required'});
        }
        const userEmail = ;


        
    }
}