import assert from "node:assert";
import { describe, it } from "node:test";
import { createChoice } from "../src/quizzes/vitestFunction.ts";


describe("square mode", () => {
    it("must show 4 question", () => {
        const question = {
            title: 'la question de test',
            correctAnswer: 'A',
            incorrectAnswer1: 'B',
            incorrectAnswer2: 'C',
            incorrectAnswer3: 'D'
        }
        const choices = createChoice(question, "square");
        assert(choices.length == 4);
        assert(choices.includes(question.correctAnswer));
        assert(choices.includes(question.incorrectAnswer1));
        assert(choices.includes(question.incorrectAnswer2));
        assert(choices.includes(question.incorrectAnswer3));

    })
    it("question must be shuffle", () => {
        let isShuffle = false;
        const question = {
            title: 'la question de test',
            correctAnswer: 'A',
            incorrectAnswer1: 'B',
            incorrectAnswer2: 'C',
            incorrectAnswer3: 'D'
        };
        const choicesTest = createChoice(question, "square");
        console.log(choicesTest);

        for (let i: number = 0; i < 100; i++) {
            const choices = createChoice(question, "square");
            if (choices == choicesTest) {
                isShuffle = true
                console.log(choices)

            }
        }
        assert(isShuffle.valueOf);
    })
})

describe("duo mode", () => {
    it("must show 2 question", () => {
        const question = {
            title: 'la question de test',
            correctAnswer: 'A',
            incorrectAnswer1: 'B',
            incorrectAnswer2: 'C',
            incorrectAnswer3: 'D'
        }
        const choices = createChoice(question, "duo");
        assert(choices.length == 2);
        assert(choices.includes(question.correctAnswer));
        assert(choices.includes(question.incorrectAnswer1) || choices.includes(question.incorrectAnswer2) || choices.includes(question.incorrectAnswer3));

    })
    it("question must be shuffle", () => {
        let isShuffle = false;
        let getGoodAnswer = true;
        const question = {
            title: 'la question de test',
            correctAnswer: 'A',
            incorrectAnswer1: 'B',
            incorrectAnswer2: 'C',
            incorrectAnswer3: 'D'
        };
        const choicesTest = createChoice(question, "duo");
        console.log(choicesTest);

        for (let i: number = 0; i < 100; i++) {
            const choices = createChoice(question, "duo");
            if (choices == choicesTest) {
                isShuffle = true
                console.log(choices)

            }
            if (!choices.includes(question.correctAnswer)) {
                getGoodAnswer = false
            }
        }
        assert(isShuffle.valueOf);


    })
    it("question alway as good answer", () => {
        let getGoodAnswer = true;
        const question = {
            title: 'la question de test',
            correctAnswer: 'A',
            incorrectAnswer1: 'B',
            incorrectAnswer2: 'C',
            incorrectAnswer3: 'D'
        };
        for (let i: number = 0; i < 100; i++) {
            const choices = createChoice(question, "duo");

            if (!choices.includes(question.correctAnswer)) {
                console.log(choices)
                getGoodAnswer = false
            }
        }
        assert(getGoodAnswer.valueOf);
    })
})