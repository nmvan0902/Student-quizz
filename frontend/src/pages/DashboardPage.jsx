import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, mockQuizzes, getQuizStatus, getQuizStats } from '../data/mockData';
import ReminderModal from '../components/ReminderModal';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [quizStats, setQuizStats] = useState({});
  const [quizzesWithStatus, setQuizzesWithStatus] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const updateData = () => {
      const stats = getQuizStats();
      setQuizStats(stats);
      
      const quizzesWithCurrentStatus = mockQuizzes.map(quiz => ({
        ...quiz,
        currentStatus: getQuizStatus(quiz)
      }));
      setQuizzesWithStatus(quizzesWithCurrentStatus);
    };
    
    updateData();
    
    // Cập nhật mỗi phút
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      ongoing: { color: 'var(--color-green)', text: 'Đang diễn ra', icon: '🔴' },
      starting_soon: { color: '#ff8c00', text: 'Sắp bắt đầu', icon: '⏰' },
      upcoming: { color: 'var(--color-navy)', text: 'Sắp tới', icon: '📅' },
      completed: { color: '#6c757d', text: 'Đã kết thúc', icon: '✅' }
    };
    
    const badge = badges[status] || badges.upcoming;
    
    return (
      <span 
        className="badge rounded-pill d-flex align-items-center gap-1"
        style={{ backgroundColor: badge.color, fontSize: '0.75rem' }}
      >
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const handleReminderClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowReminderModal(true);
  };

  const isQuizToday = (quiz) => {
    const today = new Date();
    const quizDate = new Date(quiz.startTime);
    return (
      quizDate.getDate() === today.getDate() &&
      quizDate.getMonth() === today.getMonth() &&
      quizDate.getFullYear() === today.getFullYear()
    );
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" style={{ color: 'var(--color-navy)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Filter quizzes
  const ongoingQuizzes = quizzesWithStatus.filter(q => q.currentStatus.status === 'ongoing');
  const todayUpcomingQuizzes = quizzesWithStatus.filter(q => 
    (q.currentStatus.status === 'upcoming' || q.currentStatus.status === 'starting_soon') && 
    isQuizToday(q)
  );
  
  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          {/* Welcome Header */}
          <div className="mb-4">
            <h1 
              className="mb-2"
              style={{ color: 'var(--color-dark)' }}
            >
              Xin chào, {user.fullName}! 👋
            </h1>
            <p 
              className="mb-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              Chào mừng bạn đến với hệ thống thi trắc nghiệm online
            </p>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div 
                className="card border-0 shadow-sm stats-card"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '60px', 
                      height: '60px',
                      backgroundColor: '#6c757d'
                    }}
                  >
                    <svg width="24" height="24" fill="var(--color-white)" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--color-navy)' }}>{quizStats.completed || 0}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Đã tham gia</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div 
                className="card border-0 shadow-sm stats-card"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '60px', 
                      height: '60px',
                      backgroundColor: 'var(--color-green)'
                    }}
                  >
                    <svg width="24" height="24" fill="var(--color-white)" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9L16 9V10C16 11.1 15.1 12 14 12V15C14 16.1 13.1 17 12 17S10 16.1 10 17V15C8.9 15 8 14.1 8 13V9L9 9V7H3V9H4V13C4 14.1 4.9 15 6 15H8V19C8 20.1 8.9 21 10 21H14C15.1 21 16 20.1 16 19V15H18C19.1 15 20 14.1 20 13V9H21Z"/>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--color-navy)' }}>{quizStats.ongoing || 0}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Đang diễn ra</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div 
                className="card border-0 shadow-sm stats-card"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '60px', 
                      height: '60px',
                      backgroundColor: 'var(--color-navy)'
                    }}
                  >
                    <svg width="24" height="24" fill="var(--color-white)" viewBox="0 0 24 24">
                      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M7 10H12V15H7"/>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--color-navy)' }}>{quizStats.todayTotal || 0}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Hôm nay</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div 
                className="card border-0 shadow-sm stats-card"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ 
                      width: '60px', 
                      height: '60px',
                      backgroundColor: '#ff8c00'
                    }}
                  >
                    <svg width="24" height="24" fill="var(--color-white)" viewBox="0 0 24 24">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--color-navy)' }}>{quizStats.upcoming || 0}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Sắp tới</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/scores"
                  className="btn d-flex align-items-center gap-2"
                  style={{ 
                    backgroundColor: 'var(--color-green)',
                    color: 'var(--color-white)'
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8L6,7L4,9M4,19H8L6,17L4,19M4,14H8L6,12L4,14Z"/>
                  </svg>
                  Xem kết quả thi
                </Link>
              </div>
            </div>
          </div>

          {/* Ongoing Quizzes Section */}
          {ongoingQuizzes.length > 0 && (
            <div className="mb-4">
              <h3 
                className="mb-3 d-flex align-items-center"
                style={{ color: 'var(--color-dark)' }}
              >
                🔴 Kỳ thi đang diễn ra ({ongoingQuizzes.length})
              </h3>
              <div className="row">
                {ongoingQuizzes.map(quiz => (
                  <div key={quiz.id} className="col-md-6 col-lg-4 mb-3">
                    <div 
                      className="card border-0 shadow-sm h-100 border-start border-4"
                      style={{ 
                        backgroundColor: 'var(--color-white)',
                        borderLeftColor: 'var(--color-green) !important'
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 
                            className="card-title mb-0"
                            style={{ color: 'var(--color-navy)' }}
                          >
                            {quiz.title}
                          </h6>
                          {getStatusBadge(quiz.currentStatus.status)}
                        </div>
                        
                        <p 
                          className="card-text small mb-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {quiz.description}
                        </p>
                        
                        <div className="mb-3">
                          <small 
                            className="text-danger fw-bold"
                          >
                            ⏰ Còn lại: {quiz.currentStatus.timeLeft}
                          </small>
                        </div>
                        
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="btn btn-sm w-100 d-flex align-items-center justify-content-center"
                          style={{ 
                            backgroundColor: 'var(--color-green)',
                            color: 'var(--color-white)'
                          }}
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                            <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                          </svg>
                          Tham gia ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Upcoming Quizzes with Reminder */}
          {todayUpcomingQuizzes.length > 0 && (
            <div className="mb-4">
              <h3 
                className="mb-3 d-flex align-items-center"
                style={{ color: 'var(--color-dark)' }}
              >
                📅 Kỳ thi hôm nay ({todayUpcomingQuizzes.length})
              </h3>
              <div className="row">
                {todayUpcomingQuizzes.map(quiz => (
                  <div key={quiz.id} className="col-md-6 col-lg-4 mb-3">
                    <div 
                      className="card border-0 shadow-sm h-100 border-start border-4"
                      style={{ 
                        backgroundColor: 'var(--color-white)',
                        borderLeftColor: '#ff8c00 !important'
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 
                            className="card-title mb-0"
                            style={{ color: 'var(--color-navy)' }}
                          >
                            {quiz.title}
                          </h6>
                          {getStatusBadge(quiz.currentStatus.status)}
                        </div>
                        
                        <p 
                          className="card-text small mb-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {quiz.description}
                        </p>
                        
                        <div className="mb-3">
                          <small 
                            style={{ 
                              color: '#ff8c00',
                              fontWeight: 'bold'
                            }}
                          >
                            ⏰ {quiz.currentStatus.timeLeft}
                          </small>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm flex-fill"
                            onClick={() => handleReminderClick(quiz)}
                            title="Cài đặt nhắc nhở"
                          >
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="me-1">
                              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22M18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
                            </svg>
                            Nhắc nhở
                          </button>
                          
                          {quiz.currentStatus.canStart && (
                            <Link
                              to={`/quiz/${quiz.id}`}
                              className="btn btn-sm flex-fill"
                              style={{ 
                                backgroundColor: 'var(--color-navy)',
                                color: 'var(--color-white)'
                              }}
                            >
                              Vào thi
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Quizzes List */}
          <div className="row">
            <div className="col-12">
              <h3 
                className="mb-4"
                style={{ color: 'var(--color-dark)' }}
              >
                Tất cả kỳ thi
              </h3>
            </div>
            
            {quizzesWithStatus.map(quiz => (
              <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 
                        className="card-title mb-0"
                        style={{ color: 'var(--color-navy)' }}
                      >
                        {quiz.title}
                      </h5>
                      {getStatusBadge(quiz.currentStatus.status)}
                    </div>
                    
                    <p 
                      className="card-text"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {quiz.description}
                    </p>
                    
                    <div className="row mb-3">
                      <div className="col-6">
                        <small style={{ color: 'var(--text-secondary)' }}>
                          <strong>Thời gian:</strong><br />
                          {quiz.duration} phút
                        </small>
                      </div>
                      <div className="col-6">
                        <small style={{ color: 'var(--text-secondary)' }}>
                          <strong>Câu hỏi:</strong><br />
                          {quiz.totalQuestions} câu
                        </small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <small 
                        style={{ 
                          color: quiz.currentStatus.status === 'ongoing' ? '#dc3545' : 'var(--text-secondary)',
                          fontWeight: quiz.currentStatus.status === 'ongoing' ? 'bold' : 'normal'
                        }}
                      >
                        {quiz.currentStatus.status === 'ongoing' ? '⏰ ' : '📅 '}
                        {quiz.currentStatus.timeLeft}
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                      {isQuizToday(quiz) && quiz.currentStatus.status !== 'ongoing' && quiz.currentStatus.status !== 'completed' && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleReminderClick(quiz)}
                          title="Cài đặt nhắc nhở"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22M18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
                          </svg>
                        </button>
                      )}
                      
                      <div className="flex-fill">
                        {quiz.currentStatus.canStart ? (
                          <Link
                            to={`/quiz/${quiz.id}`}
                            className="btn w-100 d-flex align-items-center justify-content-center"
                            style={{ 
                              backgroundColor: quiz.currentStatus.status === 'ongoing' ? 'var(--color-green)' : 'var(--color-navy)',
                              color: 'var(--color-white)'
                            }}
                          >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                              <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                            </svg>
                            {quiz.currentStatus.status === 'ongoing' ? 'Tham gia ngay' : 'Bắt đầu thi'}
                          </Link>
                        ) : (
                          <button
                            className="btn w-100"
                            disabled
                            style={{ 
                              backgroundColor: '#6c757d',
                              color: 'var(--color-white)'
                            }}
                          >
                            {quiz.currentStatus.status === 'completed' ? 'Đã kết thúc' : 'Chưa đến giờ'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && selectedQuiz && (
        <ReminderModal
          quiz={selectedQuiz}
          onClose={() => setShowReminderModal(false)}
          onSave={() => {
            // Có thể thêm logic refresh data nếu cần
          }}
        />
      )}
    </div>
  );
}