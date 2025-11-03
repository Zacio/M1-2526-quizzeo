import express from 'express';
import {createAuthRoutes} from './auth/routes.ts';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import type {User} from './auth/routes.ts';
import { checkAuth } from './auth/middlewares.ts';

declare module "express-session" {
    interface SessionData {
        user: User | null
    }}


export function createApp() {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        secret : process.env.SESSION_SECRET!,
        resave : true,
        saveUninitialized : false
    }))

    app.get('/hello', checkAuth, (req, res) => {
        res.send('Hello World')
    })

    app.use((err,req,res,next)=>{
        res.sendStatus(err)
    })

    app.use("/auth",createAuthRoutes())

    return app
}
