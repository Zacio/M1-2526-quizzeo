import { shuffleArray } from "../global.ts";
import type { Question, Mode } from "./questionTypes.ts"

export function createChoice(question : Question, mode : Mode){

    const choice : string[] = [];

    if(mode == "square"){
    choice.push(question.correctAnswer);
    choice.push(question.incorrectAnswer1);
    choice.push(question.incorrectAnswer2);
    choice.push(question.incorrectAnswer3);
    return shuffleArray(choice);
    }else{
        const finalChoice : string[] = [];
        choice.push(question.incorrectAnswer1);
        choice.push(question.incorrectAnswer2);
        choice.push(question.incorrectAnswer3);
        finalChoice.push(choice[Math.floor(Math.random() * 3)])
        finalChoice.push(question.correctAnswer)
        return shuffleArray(finalChoice);
    }
    

}