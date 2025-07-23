// filepath: src/pages/QuizPage.jsx
import { useState } from 'react';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const mockQuestion = {
    id: 1,
    question: "Câu hỏi mẫu?",
    options: [
      "Đáp án A",
      "Đáp án B",
      "Đáp án C",
      "Đáp án D"
    ]
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Câu hỏi {currentQuestion + 1}</h2>
          <p className="mt-2">{mockQuestion.question}</p>
        </div>
        
        <div className="space-y-3">
          {mockQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name={`question-${mockQuestion.id}`}
                value={index}
                checked={answers[mockQuestion.id] === index}
                onChange={() => setAnswers({...answers, [mockQuestion.id]: index})}
                className="mr-3"
              />
              <label>{option}</label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Câu trước
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            Câu tiếp
          </button>
        </div>
      </div>
    </div>
  );
}