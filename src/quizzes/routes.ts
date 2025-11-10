import express from 'express';
import type {NextFunction} from 'express';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { checkAuth } from '../auth/middlewares.ts';
import { db } from '../database.ts';
import { shuffleArray } from '../global.ts';
import { getQuizzes, getQuizById, getQuizQuestionDuo, getQuizQuestion, insertQuiz } from './controller.ts';

export function createQuizzesRoutes() {
    const app = express()
        app.use(express.urlencoded({ extended: true }))
        app.use(session({
            secret : process.env.SESSION_SECRET!,
            resave : true,
            saveUninitialized : false
        }))
    app.get('/', getQuizzes);

    app.get('/:id', checkAuth, getQuizById);

    app.get('/:id/question/:questionId/duo', checkAuth, getQuizQuestionDuo);

    app.get('/:id/question/:questionId', checkAuth, getQuizQuestion);

    app.post('/', checkAuth, insertQuiz)

    app.use((err: any , req:any, res:any, next:NextFunction)=>{
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            console.error(err);
            return;
        })
    return app;
}