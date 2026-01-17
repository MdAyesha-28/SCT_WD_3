const quizData = [
    {
        type: "single",
        question: "HTML stands for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Mark Language"
        ],
        answer: [0]
    },
    {
        type: "multi",
        question: "Which are JavaScript frameworks?",
        options: ["React", "Angular", "CSS", "Vue"],
        answer: [0, 1, 3]
    },
    {
        type: "fill",
        question: "CSS stands for ________",
        answer: ["cascading style sheets"]
    }
];

let index = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const fillBlank = document.getElementById("fillBlank");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const resultEl = document.getElementById("result");

loadQuestion();
startTimer();

function loadQuestion() {
    clearInterval(timer);
    startTimer();

    const q = quizData[index];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    fillBlank.style.display = "none";

    progressBar.style.width = `${((index) / quizData.length) * 100}%`;

    if (q.type === "fill") {
        fillBlank.style.display = "block";
        fillBlank.value = "";
    } else {
        q.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = "option";
            div.innerHTML = `<input type="${q.type === 'multi' ? 'checkbox' : 'radio'}" name="option"> ${opt}`;
            optionsEl.appendChild(div);
        });
    }
}

nextBtn.onclick = () => {
    const q = quizData[index];
    let isCorrect = false;

    if (q.type === "fill") {
        const userAnswer = fillBlank.value.trim().toLowerCase();
        const correctAnswers = q.answer.map(ans => ans.toLowerCase());

    if (correctAnswers.includes(userAnswer)) {
    score++;
    isCorrect = true;
}

    } else {
        const options = optionsEl.querySelectorAll(".option");
        const inputs = optionsEl.querySelectorAll("input");

        const selected = [...inputs]
            .map((el, i) => el.checked ? i : null)
            .filter(i => i !== null);

        // Check correctness
        if (JSON.stringify(selected) === JSON.stringify(q.answer)) {
            score++;
            isCorrect = true;
        }

        // Show correct & wrong answers
        options.forEach((option, i) => {
            option.classList.add("disabled");

            if (q.answer.includes(i)) {
                option.classList.add("correct");
            } else if (selected.includes(i)) {
                option.classList.add("wrong");
            }
        });
    }

    nextBtn.disabled = true;

    setTimeout(() => {
        index++;
        nextBtn.disabled = false;

        if (index < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1500);
};


function showResult() {
    clearInterval(timer);
    questionEl.textContent = "Quiz Completed 🎉";
    optionsEl.innerHTML = "";
    fillBlank.style.display = "none";
    nextBtn.textContent = "Restart Quiz";

    const percentage = Math.round((score / quizData.length) * 100);

    resultEl.innerHTML = `
        Score: ${score}/${quizData.length}<br>
        Percentage: ${percentage}%
    `;

    nextBtn.onclick = () => location.reload();
}

function startTimer() {
    timeLeft = 30;
    timerEl.textContent = `⏱ ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱ ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            nextBtn.click();
        }
    }, 1000);
}
