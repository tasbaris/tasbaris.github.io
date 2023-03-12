//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countofQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let exit = document.getElementById("exit");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let loadScreen = document.querySelector(".load-screen");
let startButton = document.getElementById("start-button");
let level = document.getElementById("level");
let isLoading = false;
let scoreCount = 0;
let count = 15;
let questionCount;
let countdown;
let quizArray;

//Questions And Options Array
exit.addEventListener("click",()=>{
    displayContainer.classList.add("hide");
    startScreen.classList.remove("hide");
    exit.classList.add("hide");
});
//Restart count
restart.addEventListener("click",()=>{
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
    scoreContainer.classList.add("hide");
    exit.classList.add("hide");
});
//next button
nextBtn.addEventListener("click",(displayNext = () =>{
  timeLeft.classList.remove("low-timer");

    //increment questionCount
    questionCount += 1;
    if (questionCount == quizArray.length){
        //hide question container and display score
        displayContainer.classList.add("hide");
        scoreContainer.classList.add("hide");
        exit.classList.add("hide");
        //user score
        userScore.innerHTML = questionCount + " soruda "+scoreCount+ " doğru cevapladınız!";
    }
    else{
        //display questionCount
        countofQuestion.innerHTML = 1+questionCount +" \/ "+quizArray.length + " Soru";
        ///display quiz
        count=15;
        clearInterval(countdown);
        timerDisplay();
        quizDisplay(questionCount);
    }
}));

//Timer
const timerDisplay = () =>{
  timeLeft.innerHTML = count+"s";
    countdown = setInterval(()=>{
        count--;
        timeLeft.innerHTML = count+"s";
        if(count <= 5){
            timeLeft.classList.add("low-timer");
        }
        if (count==0) {
            clearInterval(countdown);
            showCorrect();
        }
    },1000)
}

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    //hide other cards
    quizCards.forEach((cards)=>{
        cards.classList.add("hide");
    });
    //display current question card
    quizCards[questionCount].classList.remove("hide");
}

//Quiz Creation

function quizCreator(){
    //randomly sort questions
    quizArray.sort(()=>Math.random()- 0.5);
    //generate quiz
    for(let i of quizArray){
        i.options.sort(()=> Math.random() - 0.5);
        //quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        //question number
        countofQuestion.innerHTML = 1 +" \/ "+ quizArray.length + " Soru";
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        div.appendChild(question_DIV);
        //options
        div.innerHTML += `
        <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
        <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
        <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
        <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
        `;
        quizContainer.appendChild(div);
    }
}

//Checker Fuction to check if option is correct
function showCorrect() {
  timeLeft.classList.remove("low-timer");
  let question = document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");
  options.forEach((element)=>{
    if(element.innerText == quizArray[questionCount].correct){
        element.classList.add("correct");
      }
      element.disabled = true;
  });
}
function checker(userOption) {
  timeLeft.classList.remove("low-timer");
    let userSolution = userOption.innerText;
    let question = document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    //if user clicked answer == correct option stored in
    if (userSolution === quizArray[questionCount].correct) {
        userOption.classList.add("correct");
        scoreCount++;
    }
    else{
        userOption.classList.add("incorrect");
        //For marking the correct option
        options.forEach((element)=>{
            if(element.innerText == quizArray[questionCount].correct){
                element.classList.add("correct");
            }
        });
    }
    //clear interval(stop timer)
    clearInterval(countdown);
    //disable all options
    options.forEach((element)=>{
        element.disabled = true;
    });
}


//initial setup
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 15;
    displayContainer.classList.remove("hide");
    loadScreen.classList.add("hide");
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
    exit.classList.remove("hide");

}

startButton.addEventListener("click",() => {
    levelSelect();
    startScreen.classList.add("hide");
    loadScreen.classList.remove("hide");
    setTimeout(initial,1500);
});


function levelSelect(){
    let selectedLevel = level.value;
    switch (selectedLevel) {
        case "easy":
            fetch("./quizler/kolay1.json",{cache : "no-cache"})
                .then(response => response.json())
                .then(data => quizArray = data)
                .catch(error => console.error(error));
            break;
        case "medium":
            fetch("./quizler/orta1.json",{cache : "no-cache"})
                .then(response => response.json())
                .then(data => quizArray = data)
                .catch(error => console.error(error));
            break;
        case "hard":
            fetch("./quizler/zor1.json",{cache : "no-cache"})
                .then(response => response.json())
                .then(data => quizArray = data)
                .catch(error => console.error(error));
            break;
    }
}

//hide quiz and display start screen
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
    loadScreen.classList.add("hide");
};
