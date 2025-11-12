import express from 'express';
import type { NextFunction } from 'express';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { checkAuth } from '../auth/middlewares.ts';
import { getUser, getUserQuizzes, getUserRunnedQuizzes, insertUserRunnedQuizzes, updateUserRunnedQuizzesAnswer } from './controller.ts';

export function usersRoutes() {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: false
    }))

    app.get('/:id',checkAuth, getUser);

    app.get('/:id/quizzes', checkAuth, getUserQuizzes);

    app.get('/:id/runned-quizzes', checkAuth, getUserRunnedQuizzes)

    app.post('/runned-quizzes', checkAuth, insertUserRunnedQuizzes);

    app.post('/runned-quizzes/answer', checkAuth, updateUserRunnedQuizzesAnswer);
    return app;
}