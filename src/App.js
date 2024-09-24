import React, { useState, useEffect } from "react";
import "./App.css";
import QuizView from "./components/QuizView";
import ScoreView from "./components/ScoreView";
import TopBar from "./components/TopBar"; // Ensure this import is present

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [alert, setAlert] = useState("");
  const [alertType, setAlertType] = useState("");

  const categories = [
    { name: "Select a category", id: "" },
    { name: "Computer", id: 18 },
    { name: "Politics", id: 24 },
    { name: "Sports", id: 21 },
    { name: "General Knowledge", id: 9 },
    { name: "History", id: 23 },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory) return;
      setIsLoading(true);
      try {
        const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&type=multiple`);
        const data = await response.json();

        if (data.results) {
          const formattedQuestions = data.results.map(q => ({
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map(answer => ({
              text: answer,
              isCorrect: answer === q.correct_answer,
            })),
          }));
          setQuestions(formattedQuestions);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory]);

  const handleAnswerClick = (isCorrect, answer) => {
    if (isCorrect) {
      setScore(score + 1);
      if (score + 1 === 5) {
        showAlert("You have 5 correct answers!", "alert-primary");
      }
    } else {
      showAlert("Wrong answer! Try again.", "alert-danger");
    }
    setUserAnswers([...userAnswers, { answer, isCorrect }]);

    const next = currentQuestion + 1;
    if (next < questions.length) setCurrentQuestion(next);
    else setIsQuizOver(true);
  };

  const handleResetClick = () => {
    setScore(0);
    setCurrentQuestion(0);
    setIsQuizOver(false);
    setUserAnswers([]);
    setQuizStarted(false);
    setSelectedCategory("");
    setAlert(""); // Clear alert on reset
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    showAlert("Welcome to the Quiz!", "alert-success");
  };

  const showAlert = (message, type) => {
    setAlert(message);
    setAlertType(type);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  useEffect(() => {
    if (isQuizOver) {
      if (score >= 5) {
        showAlert("Congratulations! You passed the quiz!", "alert-success");
        new Audio(process.env.PUBLIC_URL + '/sounds/pass.mp4').play(); // Play pass sound
      } else {
        showAlert("You failed the quiz. Better luck next time!", "alert-danger");
        new Audio(process.env.PUBLIC_URL + '/sounds/fail.mp4').play(); // Play fail sound
      }
    }
  }, [isQuizOver, score]); // Include score as a dependency

  return (
    <div className="App">
      <TopBar /> 
      {alert && <div className={`alert ${alertType}`} role="alert">{alert}</div>}
      {!quizStarted ? (
        <div>
          <h1>Welcome to the Quiz!</h1>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleStartQuiz}
            disabled={!selectedCategory}
          >
            Get Started
          </button>
        </div>
      ) : isLoading ? (
        <div>Loading questions...</div>
      ) : isQuizOver ? (
        <ScoreView 
          handleResetClick={handleResetClick} 
          score={score} 
          totalQuestions={questions.length} 
          userAnswers={userAnswers} 
        />
      ) : (
        questions.length > 0 && (
          <QuizView
            questions={questions}
            currentQuestion={currentQuestion}
            handleAnswerClick={handleAnswerClick}
          />
        )
      )}
    </div>
  );
}

export default App;
