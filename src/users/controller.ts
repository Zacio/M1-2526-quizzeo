import { db } from '../database.ts';
import { getUserById, getUserQuizzesFromDb, getUserRunnedQuizzesFromDb, insertUserRunnedQuizzesInDb, updateUserRunnedQuizzesAnswerInDb } from './service.ts';
import { getDbQuizById, getDbQuizQuestionByquizzId } from '../quizzes/service.ts';
import { get } from 'http';
import { Cookie } from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";

type User = {
    id: number,
    email: string
}

export const getUser = async (req: any, res: any) => {
    const id = req.params.id as number;
    const users = await getUserById(id);
    res.send(users as User);
    return;
} 

export const getUserQuizzes = async (req: any, res: any) => {
    const id = req.params.id as number;
    const quizzesList = [];
    const quizzes = await getUserQuizzesFromDb(id);
    for (const quiz of quizzes) {
        const questions = await getDbQuizQuestionByquizzId(quiz.id);
        quizzesList.push({...quiz, questions: questions});
    }

    res.send(quizzesList);
    return;
}

export const getUserRunnedQuizzes = async (req: any, res: any) => {
    const id = req.params.id as number;
    const runnedQuizzes = await getUserRunnedQuizzesFromDb(id);
    res.send(runnedQuizzes);
    return;
}

export const insertUserRunnedQuizzes = async (req: any, res: any) => {
    const token = req.cookies['auth_token'];
    const decoded = jwt.decode(token);
    const userId = (decoded as any).id;
    const quizzId = req.body.quizzId as number;
    const quizzQuestions = await getDbQuizQuestionByquizzId(quizzId);
    const totalQuestions = quizzQuestions.length;
    try {
        insertUserRunnedQuizzesInDb(quizzId, userId, totalQuestions as number);
        res.send({message: "Runned quizz inserted"});
    } catch (error) {
        res.status(500).send({message: "Could not insert runned quizz"});
        console.log(error);
    }

}

export const updateUserRunnedQuizzesAnswer = async (req: any, res: any) => {
    const runnedQuizzId = req.body.runnedQuizzId as number;
    const isCorrect = req.body.isCorrect as boolean;
    const timeTaken: Date = new Date();
console.log(runnedQuizzId)
console.log(isCorrect)
    console.log(timeTaken)
    try {
        await updateUserRunnedQuizzesAnswerInDb(runnedQuizzId, isCorrect, timeTaken);
        res.send({message: "Runned quizz updated"});
    }catch(error){
        res.status(500).send({message: "Could not update runned quizz"});
        console.log(error);
    };

}