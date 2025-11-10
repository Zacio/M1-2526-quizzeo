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

    function shuffleArray(array: string[]){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        console.log(array);
        return array;
    }

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
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
        const offset = (page -1) * pageSize;
        const quizzes = await db!.query(`SELECT * FROM QUIZZES LIMIT ? OFFSET ?`,
            [pageSize, offset]
        );
        res.send(quizzes);
        return;
    })

    app.get('/quiz/:id', checkAuth, async (req, res)=>{
        console.log("test");
        const quizId = req.params.id;
        const quiz= await db!.query(`SELECT title FROM QUIZZES WHERE QUIZZES.id = ?`,
            [quizId]);
        const questions = await db!.query(`SELECT title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 FROM QUESTIONS WHERE QUESTIONS.quizId = ?`,
            [quizId]
        )
        if(quiz.length == 0 || questions.length == 0){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        const quizWithQuestions = {
            ...quiz[0],
            questions: questions
        }
        res.send(quizWithQuestions);
        return;
    })

    app.get('/quiz/:id/question/:questionId/duo', checkAuth, async (req, res)=>{
        console.log("test");
        const quizId = req.params.id;
        const questionId = req.params.questionId;
        const quiz= await db!.query(`SELECT title, id FROM QUIZZES WHERE QUIZZES.id = ?`,
            [quizId]);
        const questions = await db!.query(`SELECT title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 FROM QUESTIONS WHERE QUESTIONS.id = ?`,
            [questionId]
        )
        if(quiz.length == 0 || questions.length == 0){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        const answerRand = Math.random() * 3;
        const questionDuo = {
            title: quiz[0].title,
            quizId: quiz[0].id,
            mode: "duo",
            questionTitle: questions[0].title,
            correctAnswer: questions[0].correctAnswer,
            answer: shuffleArray([questions[0].correctAnswer,
            answerRand < 1 ? questions[0].incorrectAnswer1 : answerRand < 2 ? questions[0].incorrectAnswer2 : questions[0].incorrectAnswer3])
        }
        res.send(questionDuo);
        return;
    })

    app.get('/quiz/:id/question/:questionId', checkAuth, async (req, res)=>{
        console.log("test");
        const quizId = req.params.id;
        const questionId = req.params.questionId;
        const quiz= await db!.query(`SELECT title, id FROM QUIZZES WHERE QUIZZES.id = ?`,
            [quizId]);
        const questions = await db!.query(`SELECT title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 FROM QUESTIONS WHERE QUESTIONS.id = ?`,
            [questionId]
        )
        if(quiz.length == 0 || questions.length == 0){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        const allAnswers = [
            questions[0].correctAnswer,
            questions[0].incorrectAnswer1,
            questions[0].incorrectAnswer2,
            questions[0].incorrectAnswer3
        ];
        const shuffleAnswers = shuffleArray(allAnswers);
        const questionAll = {
            title: quiz[0].title,
            quizId: quiz[0].id,
            mode: "normal",
            questionTitle: questions[0].title,
            correctAnswer: questions[0].correctAnswer,
            answer: shuffleAnswers
        }
        res.send(questionAll);
        return;
    })

    app.use((err:any , req:any, res:any, next:any)=>{
        console.log(err);
        res.sendStatus(err);
    
    })

    app.use("/auth",createAuthRoutes())

    return app
}
