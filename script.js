const players = [];
let selectedGenre = null;
let selectedQuestions = [];
let currentQuestionIndex = 0;
let playerIndex = 0;

const questionBank = {
  movies: [
    {
      question: "Which movie won Best Picture in 2020?",
      options: ["1917", "Joker", "Parasite", "Ford v Ferrari"],
      answer: 2,
    },
    {
      question: "Who directed 'Inception'?",
      options: ["Nolan", "Spielberg", "Tarantino", "Cameron"],
      answer: 0,
    },
  ],
  history: [
    {
      question: "Who was the first President of India?",
      options: ["Dr. Rajendra Prasad", "Nehru", "Gandhi", "Patel"],
      answer: 0,
    },
    {
      question: "When did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      answer: 2,
    },
  ],
  science: [
    {
      question: "What planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: 1,
    },
    {
      question: "What gas do plants absorb?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      answer: 2,
    },
  ],
  sports: [
    {
      question: "How many players in a football team?",
      options: ["9", "10", "11", "12"],
      answer: 2,
    },
    {
      question: "Who won FIFA 2022?",
      options: ["France", "Brazil", "Argentina", "Germany"],
      answer: 2,
    },
  ],
};

document.querySelectorAll(".genre-card").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll(".genre-card")
      .forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");

    const genre = card.getAttribute("data-genre");
    selectedGenre = genre;

    const name1 = document.getElementById("player1").value.trim();
    const name2 = document.getElementById("player2").value.trim();

    if (!name1 || !name2) {
      alert("Please enter both player names.");
      return;
    }

    players[0] = { name: name1, score: 0 };
    players[1] = { name: name2, score: 0 };

    generateMixedQuestions();
    startQuiz();
  });
});

document.getElementById("setup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  players[0] = { name: document.getElementById("player1").value, score: 0 };
  players[1] = { name: document.getElementById("player2").value, score: 0 };

  if (!selectedGenre) return alert("Please select a genre!");

  prepareQuestions();
  startQuiz();
});

function prepareQuestions() {
  const genres =
    selectedGenre === "random" ? Object.keys(questionBank) : [selectedGenre];
  selectedQuestions = [];
  genres.forEach((g) => {
    const shuffled = [...questionBank[g]].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, 2));
  });
  selectedQuestions.sort(() => 0.5 - Math.random());
}

function startQuiz() {
  document.getElementById("setup-form").classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestionIndex];
  document.getElementById("question").innerText = q.question;
  document.getElementById("question-counter").innerText = `Q ${
    currentQuestionIndex + 1
  } of ${selectedQuestions.length}`;
  document.getElementById(
    "current-player"
  ).innerText = `${players[playerIndex].name}'s Turn`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(i);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("next-btn").classList.add("hidden");
}

function handleAnswer(index) {
  const correct = selectedQuestions[currentQuestionIndex].answer;
  if (index === correct) players[playerIndex].score++;
  currentQuestionIndex++;
  playerIndex = (playerIndex + 1) % 2;

  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  document.getElementById("show-scoreboard").onclick = () => {
    document.getElementById("scoreboard-section").classList.remove("hidden");
    const list = document.getElementById("scoreboard");
    list.innerHTML = "";
    players.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `${p.name}: ${p.score}`;
      list.appendChild(li);
    });

    const winnerText = document.getElementById("winner-announcement");
    const [p1, p2] = players;
    if (p1.score > p2.score) winnerText.textContent = ` ${p1.name} Wins`;
    else if (p2.score > p1.score) winnerText.textContent = ` ${p2.name} Wins`;
    else winnerText.textContent = ` It's a tie`;
  };
}
