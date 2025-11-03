import express from 'express';
import {createAuthRoutes} from './auth/routes.ts';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import type {User} from './auth/routes.ts';
import { checkAuth } from './auth/middlewares.ts';
import { db } from './database.ts';

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

    app.get('/quizzes', async (req, res)=>{
        const quizzes = await db!.query(`SELECT * FROM QUIZZES`);
        res.send(quizzes);
        return;
    })

    app.get('/quiz/:id', checkAuth, async (req, res)=>{
        console.log("test");
        const quizId = req.params.id;
        const quiz= await db!.query(`SELECT * FROM QUIZZES INNER JOIN QUESTIONS ON QUIZZES.id = QUESTIONS.quizId WHERE QUIZZES.id = ?`,
            [quizId]);
        if(quiz.length == 0){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        res.send(quiz[0]);
        return;
    })

    app.use((err,req,res,next)=>{
        res.sendStatus(err)
    })

    app.use("/auth",createAuthRoutes())

    return app
}
