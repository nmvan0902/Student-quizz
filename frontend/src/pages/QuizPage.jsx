import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockQuizzes, getCurrentUser } from '../data/mockData';
import WebcamMonitor from '../components/WebcamMonitor';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [user, setUser] = useState(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [violations, setViolations] = useState([]);
  const [showViolationModal, setShowViolationModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const foundQuiz = mockQuizzes.find(q => q.id === parseInt(id));
    if (!foundQuiz) {
      navigate('/dashboard');
      return;
    }

    setQuiz(foundQuiz);
    setTimeLeft(foundQuiz.duration * 60); // Convert to seconds
  }, [id, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz(true); // Auto submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
    setShowQuestionList(false);
  };

  const handleSubmitQuiz = (autoSubmit = false) => {
    if (autoSubmit) {
      // Auto submit logic
      const score = calculateScore();
      alert(`Thời gian đã hết! Điểm của bạn: ${score}/${quiz.questions.length}`);
      navigate('/dashboard');
    } else {
      setShowSubmitModal(true);
    }
  };

  const confirmSubmit = () => {
    const score = calculateScore();
    alert(`Bạn đã nộp bài thành công! Điểm của bạn: ${score}/${quiz.questions.length}`);
    navigate('/dashboard');
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleExitQuiz = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    navigate('/dashboard');
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current';
    if (answers.hasOwnProperty(index)) return 'answered';
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const handleWebcamReady = (ready) => {
    setWebcamReady(ready);
  };

  const handleWebcamError = (error) => {
    // Ghi nhận vi phạm
    const violation = {
      id: Date.now(),
      type: 'webcam_violation',
      description: error,
      timestamp: new Date().toISOString()
    };
    
    setViolations(prev => [...prev, violation]);
    
    // Hiển thị cảnh báo
    setShowViolationModal(true);
    
    // Nếu vi phạm nghiêm trọng (>3 lần), tự động nộp bài
    if (violations.length >= 2) {
      alert('Quá nhiều vi phạm! Bài thi sẽ được nộp tự động.');
      handleSubmitQuiz(true); // Auto submit
    }
  };

  if (!quiz || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" style={{ color: 'var(--color-navy)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const isTimeWarning = timeLeft <= 300; // 5 minutes warning

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div 
        className="d-flex justify-content-between align-items-center p-3 shadow-sm position-sticky top-0"
        style={{ backgroundColor: 'var(--color-white)', zIndex: 1000 }}
      >
        <div className="d-flex align-items-center">
          <div 
            className="me-3 p-2 rounded-circle"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            <svg width="20" height="20" fill="var(--color-white)" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 9V16H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <div>
            <h5 className="mb-0" style={{ color: 'var(--color-dark)' }}>
              {quiz.title}
            </h5>
            <small style={{ color: 'var(--text-secondary)' }}>
              Câu {currentQuestion + 1} / {quiz.questions.length} 
              <span className="ms-2">
                Đã trả lời: {getAnsweredCount()}/{quiz.questions.length}
              </span>
            </small>
          </div>
        </div>

        {/* Webcam Monitor trong header */}
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: '120px' }}>
            <WebcamMonitor 
              onWebcamReady={handleWebcamReady}
              onWebcamError={handleWebcamError}
              isQuizStarted={true}
            />
          </div>
          
          {/* Timer */}
          <div className="text-center">
            <div 
              className="fw-bold"
              style={{ 
                color: timeLeft <= 300 ? '#dc3545' : 'var(--color-dark)',
                fontSize: '1.2rem',
                fontFamily: 'monospace'
              }}
            >
              {formatTime(timeLeft)}
            </div>
            <small style={{ color: 'var(--text-secondary)' }}>Thời gian còn lại</small>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Question Panel */}
          <div className="col-lg-8">
            {/* ...existing question content... */}
            <div 
              className="card border-0 shadow-sm"
              style={{ backgroundColor: 'var(--color-white)' }}
            >
              <div className="card-body p-4">
                {/* Question */}
                <div className="mb-4">
                  <div className="d-flex align-items-start mb-3">
                    <span 
                      className="badge rounded-pill me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        backgroundColor: 'var(--color-navy)',
                        color: 'var(--color-white)',
                        minWidth: '40px',
                        height: '40px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {currentQuestion + 1}
                    </span>
                    <h4 
                      className="mb-0 flex-grow-1"
                      style={{ color: 'var(--color-dark)', lineHeight: '1.4' }}
                    >
                      {currentQuestionData?.question}
                    </h4>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="mb-4">
                  {currentQuestionData?.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`d-flex align-items-center p-3 mb-3 rounded cursor-pointer ${
                        answers[currentQuestion] === index 
                          ? 'border-2' 
                          : 'border'
                      }`}
                      style={{ 
                        borderColor: answers[currentQuestion] === index 
                          ? 'var(--color-green)' 
                          : '#dee2e6',
                        backgroundColor: answers[currentQuestion] === index 
                          ? 'rgba(6, 150, 91, 0.1)' 
                          : 'var(--color-white)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                        style={{ 
                          width: '24px',
                          height: '24px',
                          border: '2px solid',
                          borderColor: answers[currentQuestion] === index 
                            ? 'var(--color-green)' 
                            : '#dee2e6',
                          backgroundColor: answers[currentQuestion] === index 
                            ? 'var(--color-green)' 
                            : 'transparent'
                        }}
                      >
                        {answers[currentQuestion] === index && (
                          <svg width="12" height="12" fill="var(--color-white)" viewBox="0 0 24 24">
                            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                          </svg>
                        )}
                      </div>
                      <span 
                        className="fw-medium me-3"
                        style={{ 
                          color: 'var(--color-navy)',
                          minWidth: '20px'
                        }}
                      >
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span 
                        style={{ 
                          color: 'var(--color-dark)',
                          fontSize: '1rem'
                        }}
                      >
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Webcam Monitor (chi tiết) */}
            <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--color-white)' }}>
              <div className="card-header border-0" style={{ backgroundColor: 'var(--color-gray)' }}>
                <h6 className="mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-dark)' }}>
                  <svg width="16" height="16" fill="var(--color-navy)" viewBox="0 0 24 24">
                    <path d="M17,9H16V6A4,4 0 0,0 12,2A4,4 0 0,0 8,6V9H7A2,2 0 0,0 5,11V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V11A2,2 0 0,0 17,9M12,4A2,2 0 0,1 14,6V9H10V6A2,2 0 0,1 12,4Z"/>
                  </svg>
                  Giám sát thi
                </h6>
              </div>
              <div className="card-body p-3">
                <WebcamMonitor 
                  onWebcamReady={handleWebcamReady}
                  onWebcamError={handleWebcamError}
                  isQuizStarted={true}
                />
                
                {violations.length > 0 && (
                  <div className="mt-3">
                    <div className="alert alert-warning">
                      <small>
                        <strong>⚠️ Vi phạm: {violations.length}</strong><br />
                        Hành vi không phù hợp đã được ghi nhận.
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ...existing sidebar content... */}
          </div>
        </div>
      </div>

      {/* Violation Modal */}
      {showViolationModal && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title text-dark">
                  ⚠️ Cảnh báo vi phạm
                </h5>
              </div>
              <div className="modal-body">
                <p className="text-danger">
                  <strong>Đã phát hiện vi phạm trong quá trình thi!</strong>
                </p>
                <p>
                  Vi phạm gần nhất: {violations[violations.length - 1]?.description}
                </p>
                <p className="small text-muted">
                  • Tổng số vi phạm: {violations.length}<br />
                  • Nếu vi phạm quá 3 lần, bài thi sẽ bị hủy tự động<br />
                  • Vui lòng tuân thủ quy định thi
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-warning"
                  onClick={() => setShowViolationModal(false)}
                >
                  Tôi hiểu, tiếp tục thi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: 'var(--color-dark)' }}>
                  Xác nhận thoát
                </h5>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)' }}>
                  Bạn có chắc chắn muốn thoát khỏi bài thi? Dữ liệu sẽ không được lưu.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowExitModal(false)}
                >
                  Hủy
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={confirmExit}
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div 
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: 'var(--color-dark)' }}>
                  Xác nhận nộp bài
                </h5>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)' }}>
                  Bạn có chắc chắn muốn nộp bài? 
                </p>
                <div className="alert alert-info">
                  <strong>Thống kê:</strong><br />
                  Tổng số câu: {quiz.questions.length}<br />
                  Đã trả lời: {getAnsweredCount()}<br />
                  Chưa trả lời: {quiz.questions.length - getAnsweredCount()}<br />
                  Thời gian còn lại: {formatTime(timeLeft)}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Tiếp tục làm bài
                </button>
                <button 
                  className="btn btn-success"
                  onClick={confirmSubmit}
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}