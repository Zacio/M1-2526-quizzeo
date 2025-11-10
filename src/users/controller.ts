import { db } from '../database.ts';
import { getUserById, getUserQuizzesFromDb } from './service.ts';

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
    const quizzes = await getUserQuizzesFromDb(id);
    res.send(quizzes);
    return;
}