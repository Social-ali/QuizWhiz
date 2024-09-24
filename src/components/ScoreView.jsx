import React from "react";
import "./ScoreView.css";

const ScoreView = ({ handleResetClick, score, totalQuestions, userAnswers }) => {
  return (
    <div>
      <h2>Your Score: {score} / {totalQuestions}</h2>
      <div>
        <h3>Review Your Answers:</h3>
        {userAnswers.map((item, index) => (
          <div key={index}>
            <p>
              Q{index + 1}: {item.answer} - {item.isCorrect ? "Correct" : "Wrong"}
            </p>
          </div>
        ))}
      </div>
      <button onClick={handleResetClick}>Try Again</button>
    </div>
  );
};

export default ScoreView;
