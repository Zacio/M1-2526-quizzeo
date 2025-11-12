import { Router} from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";
import { db } from '../database.ts';
import jwt from "jsonwebtoken";


export type User = {
    email: string,
    pwdHash: string
}

//const users : User[] = []

const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
})

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

export function createAuthRoutes() {
    const router = Router()

    router.post('/signup', async (req, res) => {
        const body = req.body
        
        try {
            const signupData = signupSchema.parse(body)
            if(signupData.password != signupData.confirmPassword){
                res.sendStatus(StatusCodes.BAD_REQUEST)
                return
            }

            /*users.push({
                email: signupData.email,
                pwdHash: await hash(signupData.password,10)
            })*/
            await db!.execute(`
                INSERT INTO USERS (email, password) VALUES (?, ?)`,
                [signupData.email, await hash(signupData.password,10)]
            )
            res.sendStatus(StatusCodes.OK)
            return
        } catch (error) {
            console.log(error);
            res.sendStatus(StatusCodes.BAD_REQUEST)
            return
        }
    })

    router.post('/login', async (req, res) => {
        const body = req.body
        try {
            const loginData = loginSchema.parse(body)
            //const user = users.find(user => user.email == loginData.email)
            const user = await db!.query(`
                SELECT id, email, password AS pwdHash from USERS WHERE email = ?`,
            [loginData.email])
            
            if(!user){
                res.sendStatus(StatusCodes.UNAUTHORIZED)
                return
            }
            const userdata = user[0];
            if(! (await compare(loginData.password,userdata.pwdHash))){
                res.sendStatus(StatusCodes.UNAUTHORIZED)
                return
            }
            
            //old session login
            //req.session.user = userdata
            //JWT login
            const token = jwt.sign(
                {id:userdata.id}, process.env.JWT_SECRET!,
                {expiresIn: '5min'}
            )
            console.log('jswt token',token);
            res.cookie('auth_token', token, {httpOnly: true})

            console.log(' inside token', jwt.decode(token));
            console.log("inside cookie :", res.getHeaders()['set-cookie']);
            console.log('id : ', userdata.id);
            res.sendStatus(StatusCodes.OK)
            console.log(user.email);
            return
            
        } catch (error) {
            console.log(error);
            res.sendStatus(StatusCodes.BAD_REQUEST)
            return
        }
    })

    router.post('/logout', (req, res) => {
        //old session logout
        //req.session.user = null
        //JWT logout
        res.clearCookie('auth_token');
        console.log("token : clear");
        res.sendStatus(StatusCodes.OK);
        return;
    })

    return router
}