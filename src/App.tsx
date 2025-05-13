import React, { useState } from 'react';
import { Check, X, ChevronRight, Award, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Quelle est la capitale de la France ?",
    options: ["Lyon", "Marseille", "Paris", "Bordeaux"],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "Quel est le plus grand océan du monde ?",
    options: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Qui a peint la Joconde ?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Michel-Ange", "Léonard de Vinci"],
    correctAnswer: 3
  },
  {
    id: 4,
    text: "Quelle est la planète la plus proche du soleil ?",
    options: ["Vénus", "Mars", "Mercure", "Jupiter"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "Quel est l'élément chimique le plus abondant dans l'univers ?",
    options: ["Oxygène", "Hydrogène", "Carbone", "Hélium"],
    correctAnswer: 1
  }
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
  };

  const calculateFinalScore = () => {
    let rawScore = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        rawScore += 1;
      } else if (answer !== null && strictMode) {
        rawScore -= 0.5;
      }
    });
    return Math.max(0, rawScore);
  };

  const getScoreOutOf20 = () => {
    const rawScore = calculateFinalScore();
    return (rawScore / questions.length) * 20;
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    setShowAnswer(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    } else if (strictMode) {
      setScore(Math.max(0, score - 0.5));
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
    setAnswers(Array(questions.length).fill(null));
  };

  const getScoreMessage = () => {
    const finalScore = getScoreOutOf20();
    if (finalScore >= 16) return "Excellent !";
    if (finalScore >= 14) return "Très bien !";
    if (finalScore >= 12) return "Bien !";
    if (finalScore >= 8) return "Passable";
    return "À revoir";
  };

  const getStats = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    answers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === questions[index].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return { correct, incorrect, unanswered };
  };

  if (quizCompleted) {
    const stats = getStats();
    const finalScore = getScoreOutOf20();
    const passed = finalScore >= 8;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <Award className={`w-20 h-20 ${passed ? 'text-yellow-500' : 'text-gray-400'} mb-4`} />
            <h1 className="text-3xl font-bold text-center mb-2">Quiz Terminé !</h1>
            
            <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Questions totales:</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Bonnes réponses:</span>
                <span className="font-bold text-green-600">{stats.correct}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Mauvaises réponses:</span>
                <span className="font-bold text-red-600">{stats.incorrect}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Sans réponse:</span>
                <span className="font-bold text-gray-600">{stats.unanswered}</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${(finalScore / 20) * 100}%` }}
              ></div>
            </div>

            <p className="text-xl mb-2">
              Note finale: <span className="font-bold">{finalScore.toFixed(1)}/20</span>
            </p>
            <h2 className={`text-2xl font-bold mb-8 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {getScoreMessage()}
              {passed ? ' ✨' : ' ❌'}
            </h2>

            <button
              onClick={resetQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Recommencer le Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                className="rounded text-indigo-600"
              />
              Mode strict (-0.5 pt)
            </label>
            <span className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full text-sm">
              Score: {score}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="h-2 rounded-full bg-indigo-600" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <h2 className="text-xl font-bold mb-6">{currentQuestion.text}</h2>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedOption === index 
                  ? showAnswer 
                    ? index === currentQuestion.correctAnswer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-indigo-600 bg-indigo-50' 
                  : showAnswer && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
              disabled={showAnswer}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showAnswer && index === currentQuestion.correctAnswer && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {showAnswer && selectedOption === index && index !== currentQuestion.correctAnswer && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {!showAnswer ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              selectedOption === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Vérifier
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Question Suivante' : 'Voir les Résultats'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;