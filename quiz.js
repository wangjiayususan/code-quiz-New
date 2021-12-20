// Start the quiz with a timer set to 60
// Timer left will also be the final score

let timeLeft = 60;
let timerID = 0;
const timerEl = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button")
const questionContainerEl = document.getElementById("question-card");
const startContainerEl = document.getElementById("intro");
const questionEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answers-container");
const checkAnswerEl = document.getElementById("check-answer");
const viewHighScores = document.getElementById("highscores-link");
const submitButton = document.getElementById("submit-button");
const clearScoreButton = document.getElementById("clear-button");
const initialsField = document.getElementById("player-name");
const restartButton = document.getElementById("go-back-button");
const scoreField = document.getElementById("player-score");
const scores = JSON.parse(localStorage.getItem("scores")) || [];

let shuffledQuestions, currentQuestionIndex;


// Start button trigger the questions
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++
    setNextQuestion()
});


// Countdown timer
function timeTick() {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0) {
        saveScore();
    }
}


// Start Quiz
function startGame() {
    timerID = setInterval(timeTick, 1000);
    startContainerEl.classList.add("hide");
    startButton.classList.add("hide");
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerEl.classList.remove("hide");

    // Timer will start as soon as start button is clicked
    timeTick();
    setNextQuestion();
};


// Go to next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
};


// Display questions
function showQuestion(question) {
    if (question == null) {
      questionEl.innerText = "All Done.";
      document.getElementById("results").classList.remove("hide");
      return;
    }
    questionEl.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerText = answer
        button.classList.add("button")
        if (answer == question.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
        answerButtonsEl.appendChild(button)
    })
};


// Reset state function
function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add("hide")
    // checkAnswerEl.classList.add("hide")
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild
            (answerButtonsEl.firstChild)
    }
    // checkAnswerEl.innerHTML = "";
};


// Select answer function
function selectAnswer(e) {
    const selectedButton = e.target;
    //console.dir(selectedButton);
    const correct = selectedButton.dataset.correct;
    checkAnswerEl.classList.remove("hide")
    // Check if the answer correct or wrong then show text
    if (correct) {
        checkAnswerEl.innerHTML = "You got it right!";
    } else {
        checkAnswerEl.innerHTML = "Sorry that was not the correct answer.";
        if (timeLeft <= 10) {
            timeLeft = 0;
        } else {
            // If the aswer is wrong, deduct time by 10
            timeLeft -= 10;
        }
    }

    Array.from(answerButtonsEl.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide")
        checkAnswerEl.classList.remove("hide")
    } else {
        startButton.classList.remove("hide")
        saveScore();
    }
    currentQuestionIndex++;
    setNextQuestion();
};


// Check and show the correct answer by set the buttons colors
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct");
    } else {
        element.classList.add("wrong");
    }
};


// Remove all the classes
function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("wrong");
};


// Save scores
function saveScore() {
    clearInterval(timerID);
    timerEl.textContent = "Time: " + timeLeft;
    setTimeout(function () {
        localStorage.setItem("scores", JSON.stringify(scores));
        questionContainerEl.classList.add("hide");
        document.getElementById("score-container").classList.remove("hide");
        // document.getElementById("your-score").textContent = "Your final score is " + timeLeft;

    }, 2000)
};


var loadScores = function () {
    // Get score from local storage

    if (!savedScores) {
        return false;
    }

    // Convert scores from stringfield format into array
    savedScores = JSON.parse(savedScores);
    var initials = document.getElementById("initial-space").value;
    var newScore = {
        score: timeLeft,
        initials: initials
    }
    savedScores.push(newScore);
    console.log(savedScores)

    savedScores.forEach(score => {
        initialsField.innerText = score.initials
        scoreField.innerText = score.score
    })
};


// Show high scores
function showHighScores(initials) {
    document.getElementById("highscores").classList.remove("hide")
    document.getElementById("score-container").classList.add("hide");
    startContainerEl.classList.add("hide");
    questionContainerEl.classList.add("hide");
    if (typeof initials == "string") {
        var score = {
            initials, timeLeft
        }
        scores.push(score)
    }

    var highScoreEl = document.getElementById("score-container");
    highScoreEl.classList.remove("hide");
    console.log(scores)
    for (i = 0; i < scores.length; i++) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "name-div");
        div1.innerText = "User: " + scores[i].initials + " Score: " + scores[i].timeLeft;

        highScoreEl.appendChild(div1);
    }

    localStorage.setItem("scores", JSON.stringify(scores));

};


// View high scores link
viewHighScores.addEventListener("click", showHighScores);


submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    var initials = document.getElementById("initial-space").value;
    console.log(initials);
    showHighScores(initials);
});


// Restart or reload the page
restartButton.addEventListener("click", function () {
    window.location.reload();
});


// Clear localStorage items
clearScoreButton.addEventListener("click", function () {
    localStorage.clear();
    document.getElementById("score-container").innerHTML = "";
});
