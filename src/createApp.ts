import express from 'express';
import type {NextFunction} from 'express';
import {createAuthRoutes} from './auth/routes.ts';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import type {User} from './auth/routes.ts';
import { checkAuth } from './auth/middlewares.ts';
import { db } from './database.ts';
import { createQuizzesRoutes } from './quizzes/routes.ts';
import { usersRoutes } from './users/routes.ts';
import cookieParser from 'cookie-parser';

declare module "express-session" {
    interface SessionData {
        user: User | null
    }}

export function createApp() {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser());
    app.use(session({
        secret : process.env.SESSION_SECRET!,
        resave : true,
        saveUninitialized : false
    }))

    app.get('/hello', checkAuth, (req, res) => {
        res.send('Hello World')
    })

    app.use((err: any , req:any, res:any, next:NextFunction)=>{
        console.log(err);
        //res.sendStatus(err);
    
    })

    app.use("/auth",createAuthRoutes());
    app.use("/quizzes",createQuizzesRoutes());
    app.use("/users",usersRoutes());

    return app
}
