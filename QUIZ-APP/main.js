//select Elements
let countspan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitbtn = document.querySelector(".submit-btn");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            // Create Bullets + Questions Count
            createBullets(questionsCount);

            //Add Question Data
            addQuestionData(questionsObject[currentIndex], questionsCount);

            // countdown
            countdown(20, questionsCount);

            //click On Submit
            submitbtn.onclick = function(){
                
                //Get right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                //increase Index
                currentIndex++;

                //check The Answer
                checkAnswer(theRightAnswer, questionsCount);

                //Remove previous Question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                //Add Question Data
                addQuestionData(questionsObject[currentIndex], questionsCount);

                //Handle Bullets Class
                hundleBullets();

                //countdown
                clearInterval(countdownInterval);
                countdown(20, questionsCount);

                //show results
                showResults(questionsCount);
            };
        }
    }

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num){
    countspan.innerHTML = num;

    //Create Spans
    for(let i = 0; i < num; i++){

        //create Bullet
        let theBullet = document.createElement("span");

        //check if Its first Span
        if(i === 0){
            theBullet.className = "on";
        }

        //Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count){
    if(currentIndex < count){
        //create H2 Question Title
        let QuestionTitle = document.createElement("h2");
    
        //create Question Text
        let questionText = document.createTextNode(obj['title']);
    
        //Append text to heading
        QuestionTitle.appendChild(questionText);
    
        //Append the h2 to Quiz Area
        quizArea.appendChild(QuestionTitle);
    
        //craete the Answers
        for(let i = 1; i <= 4; i++){
    
            //create Main Answer div
            let mainDiv = document.createElement("div");
    
            //Add class To maindiv
            mainDiv.className = 'answer';
    
            //create Radio input
            let radioInput = document.createElement("input");
    
            //Add Type + Name + Id + DataAttribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
    
            //Make first option selected
            if(i === 1){
                radioInput.checked = true;
            }
    
            //create Lable
            let theLable = document.createElement("label");
    
            //add for Attribute
            theLable.htmlFor = `answer_${i}`;
    
            //create lable Text
            let thelableText = document.createTextNode(obj[`answer_${i}`]);
    
            //Add Text to Lable
            theLable.appendChild(thelableText);
    
            //Add Input + lable To mainDiv
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLable);
    
            //Append All Divs To AnswersArea
            answersArea.appendChild(mainDiv);
        }
    
    }
    
}

function checkAnswer(rAnswer, count){
    let answers =document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
        console.log("good Answer");
    }
}

function hundleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitbtn.remove();
        bullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count){
            theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count} Are Good`;
        } else if(rightAnswers === count){
            theResults = `<span class="perfect">Perfect</span>, All Answers Are Perfect`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} from ${count} Are Bad`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.marginTop = '10px';
    }
}

function countdown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes ;
            seconds = seconds < 10 ? `0${seconds}` : seconds ;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0){
                clearInterval(countdownInterval);
                submitbtn.click();
            }

        }, 1000);
    }
}