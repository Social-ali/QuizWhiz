import React from "react";
import "./QuizView.css";

const QuizView = ({ questions, currentQuestion, handleAnswerClick }) => {
  // Check if questions are available
  if (!questions || questions.length === 0) {
    return <div className="loading">Loading questions...</div>;
  }

  // Destructure the current question for easier access
  const { question, answers } = questions[currentQuestion];

  return (
    <>
      <div className="question">
        <div className="question-number">
          <span>
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="question-text">{question}</div>
      </div>

      <div className="answer">
        {answers.map(({ text, isCorrect }, index) => (
          <button key={index} onClick={() => handleAnswerClick(isCorrect)} className="answer-button">
            {text}
          </button>
        ))}
      </div>
    </>
  );
};

export default QuizView;
