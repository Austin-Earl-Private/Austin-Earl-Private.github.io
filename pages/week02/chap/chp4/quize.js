/**
 * This is a copy of the code in the reading for functions.
 * 
 * But I want to make it a little more functional useing callbacks and classes. So here it is.
 */


const quiz = [
    ["What is Superman's real name?","Clark Kent"],
    ["What is Wonder Woman's real name?","Diana Prince"],
    ["What is Batman's real name?","Bruce Wayne"]
    ];


function start(quiz){
    let score = 0;
    // main game loop
    for(const [question,answer] of quiz){
        const response = ask(question);
        check(response,answer);
    }
    // end of main game loop
    gameOver();
    // function declarations
    function ask(question){
        return prompt(question);
    }

    function check(response,answer){
        if(response === answer){
            alert('Correct!');
            score++;
        } else {
        alert(`Wrong! The correct answer was ${answer}`);
        }
    }
        function gameOver(){
        alert(`Game Over, you scored ${score} point${score !== 1 ? 's' : ''}`);
        }
}
// Uncoment this to start the default quiz
// start(quiz);


const game = [
        {
            question: "What is Superman's real name?",
            correctAnswer: "Clark Kent",
            ignoreCase: false,
            correctAnswerCallback: defaultCorrectAnswer,
            incorrectAnswerCallback: defaultIncorrectAnswer
        },
        {
            question: "What is Wonder Woman's real name?",
            correctAnswer: "Diana Prince",
            ignoreCase: false,
            correctAnswerCallback: defaultCorrectAnswer,
            incorrectAnswerCallback: defaultIncorrectAnswer
        },
        {
            question: "What is Batman's real name?",
            correctAnswer: "Bruce Wayne",
            ignoreCase: false,
            correctAnswerCallback: defaultCorrectAnswer,
            incorrectAnswerCallback: defaultIncorrectAnswer
        },
        {
            question: "What is the airspeed velocity of an unladen swallow?",
            correctAnswer: "What do you mean? An African or a European swallow?",
            ignoreCase: true,
            correctAnswerCallback: defaultCorrectAnswer,
            incorrectAnswerCallback: punishIncorectAnswer // change this for score changeing
        }
    ];


function defaultCorrectAnswer(answer,score){
    alert('That is Correct!');
    score++;
    return score;
}

function defaultIncorrectAnswer(answer,score){
    alert(`That is incorrect! The anwser is ${answer}`);
    return score;
}
function punishIncorectAnswer(answer,score) {
    alert(`That is incorrect! The anwser is ${answer}  -1 points!`);
    return score - 1;
}

class quizGame {
    
    constructor(quizeQuestions){

        this.questions =quizeQuestions
        this.score = 0;
    }

    promptUser(question){
        return prompt(question)
    }

    startGame() {
     this.questions.forEach(element => {
         const answer = this.promptUser(element.question);
         var correct = false;
        if (element.ignoreCase){
            if (element.correctAnswer.toUpperCase() === answer.toUpperCase()){
                correct = true;
            }
        }else{
            if (element.correctAnswer === answer){
                correct = true;
            }
        }
        if(correct){
            this.score = element.correctAnswerCallback(element.correctAnswer,this.score)
        }else{
            this.score = element.incorrectAnswerCallback(element.correctAnswer, this.score)
        }
     })  
        alert(`Game Over, you scored ${this.score} point${this.score !== 1 ? 's' : ''}`);
    }


}


new quizGame(game).startGame();