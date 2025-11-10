import { db } from '../database.ts';
import { getUserById, getUserQuizzesFromDb } from './service.ts';
import { getDbQuizQuestionByQuizId } from '../quizzes/service.ts';

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
        const questions = await getDbQuizQuestionByQuizId(quiz.id);
        quizzesList.push({...quiz, questions: questions});
    }

    res.send(quizzesList);
    return;
}