import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockQuizzes, getCurrentUser, getQuizStatus } from '../data/mockData';
import WebcamMonitor from './WebcamMonitor';

export default function WaitingRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [user, setUser] = useState(null);
  const [timeUntilStart, setTimeUntilStart] = useState(0);
  const [quizStatus, setQuizStatus] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

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
    
    // Kiểm tra trạng thái quiz
    const status = getQuizStatus(foundQuiz);
    setQuizStatus(status);

    // Nếu quiz đã bắt đầu, chuyển thẳng vào thi
    if (status.status === 'ongoing') {
      navigate(`/quiz/${id}`);
      return;
    }

    // Nếu quiz chưa đến giờ, tính thời gian còn lại
    if (status.status === 'starting_soon' || status.status === 'upcoming') {
      const startTime = new Date(foundQuiz.startTime);
      const now = new Date();
      const timeDiff = startTime - now;
      setTimeUntilStart(Math.max(0, Math.floor(timeDiff / 1000)));
    }
  }, [id, navigate]);

  // Cập nhật thời gian đếm ngược
  useEffect(() => {
    if (timeUntilStart <= 0) return;

    const timer = setInterval(() => {
      setTimeUntilStart(prev => {
        const newTime = prev - 1;
        
        // Khi hết thời gian chờ, chuyển vào thi
        if (newTime <= 0) {
          navigate(`/quiz/${id}`);
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeUntilStart, id, navigate]);

  // Cập nhật trạng thái quiz mỗi phút
  useEffect(() => {
    if (!quiz) return;

    const statusInterval = setInterval(() => {
      const status = getQuizStatus(quiz);
      setQuizStatus(status);
      
      if (status.status === 'ongoing') {
        navigate(`/quiz/${id}`);
      }
    }, 60000);

    return () => clearInterval(statusInterval);
  }, [quiz, id, navigate]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWebcamReady = (ready) => {
    setWebcamReady(ready);
    setWebcamError(null);
  };

  const handleWebcamError = (error) => {
    setWebcamError(error);
    setWebcamReady(false);
  };

  const handleReadyCheck = () => {
    setIsReady(!isReady);
  };

  const handleStartEarly = () => {
    if (quizStatus?.canStart && webcamReady) {
      navigate(`/quiz/${id}`);
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

  const canStartNow = quizStatus?.canStart && timeUntilStart <= 300 && webcamReady;

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div 
        className="d-flex justify-content-between align-items-center p-3 shadow-sm"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <div className="d-flex align-items-center">
          <div 
            className="me-3 p-2 rounded-circle"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            <svg width="20" height="20" fill="var(--color-white)" viewBox="0 0 24 24">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
            </svg>
          </div>
          <div>
            <h5 className="mb-0" style={{ color: 'var(--color-dark)' }}>
              Phòng chờ: {quiz.title}
            </h5>
            <small style={{ color: 'var(--text-secondary)' }}>
              Xin chào, {user.fullName}
            </small>
          </div>
        </div>

        <button 
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
          Quay lại Dashboard
        </button>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Countdown Timer */}
            <div className="text-center mb-5">
              <div 
                className="card border-0 shadow-lg mx-auto"
                style={{ 
                  backgroundColor: 'var(--color-white)',
                  maxWidth: '500px'
                }}
              >
                <div 
                  className="card-header border-0 text-center"
                  style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)' }}
                >
                  <h4 className="mb-0 fw-bold">
                    {timeUntilStart > 0 ? '⏰ Thời gian bắt đầu' : '🚀 Sẵn sàng bắt đầu!'}
                  </h4>
                </div>
                <div className="card-body p-4">
                  {timeUntilStart > 0 ? (
                    <>
                      <div 
                        className="display-3 fw-bold mb-3"
                        style={{ 
                          color: timeUntilStart <= 60 ? '#dc3545' : 'var(--color-green)',
                          fontFamily: 'monospace'
                        }}
                      >
                        {formatTime(timeUntilStart)}
                      </div>
                      <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                        Bài thi sẽ tự động bắt đầu khi hết thời gian chờ
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <svg width="64" height="64" fill="var(--color-green)" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
                        </svg>
                      </div>
                      <h5 style={{ color: 'var(--color-green)' }}>Đã đến giờ thi!</h5>
                      <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                        Bạn sẽ được chuyển vào phòng thi ngay bây giờ
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Information */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  <div className="card-body p-4">
                    <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-navy)' }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      Thông tin bài thi
                    </h6>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">Tên bài thi:</small>
                      <strong style={{ color: 'var(--color-dark)' }}>{quiz.title}</strong>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">Mô tả:</small>
                      <span style={{ color: 'var(--color-dark)' }}>{quiz.description}</span>
                    </div>
                    
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted d-block">Thời gian:</small>
                        <strong style={{ color: 'var(--color-dark)' }}>{quiz.duration} phút</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Số câu:</small>
                        <strong style={{ color: 'var(--color-dark)' }}>{quiz.totalQuestions} câu</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  <div className="card-body p-4">
                    <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-navy)' }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M7 10H12V15H7"/>
                      </svg>
                      Lịch trình
                    </h6>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">Thời gian bắt đầu:</small>
                      <strong style={{ color: 'var(--color-dark)' }}>
                        {formatDateTime(quiz.startTime)}
                      </strong>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">Thời gian kết thúc:</small>
                      <strong style={{ color: 'var(--color-dark)' }}>
                        {formatDateTime(quiz.endTime)}
                      </strong>
                    </div>
                    
                    <div>
                      <small className="text-muted d-block">Trạng thái:</small>
                      <span 
                        className="badge rounded-pill"
                        style={{ 
                          backgroundColor: timeUntilStart <= 0 ? 'var(--color-green)' : '#ff8c00',
                          color: 'white'
                        }}
                      >
                        {timeUntilStart <= 0 ? '🚀 Sẵn sàng' : '⏰ Đang chờ'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Webcam Monitor */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                {/* ...existing quiz information code... */}
              </div>

              <div className="col-md-6">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  <div className="card-body p-4">
                    <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-navy)' }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17,9H16V6A4,4 0 0,0 12,2A4,4 0 0,0 8,6V9H7A2,2 0 0,0 5,11V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V11A2,2 0 0,0 17,9M12,4A2,2 0 0,1 14,6V9H10V6A2,2 0 0,1 12,4Z"/>
                      </svg>
                      Giám sát thi
                    </h6>
                    
                    <WebcamMonitor 
                      onWebcamReady={handleWebcamReady}
                      onWebcamError={handleWebcamError}
                      isQuizStarted={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ...existing schedule information code... */}

            {/* Instructions với webcam requirements */}
            {showInstructions && (
              <div className="mb-4">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  <div 
                    className="card-header border-0 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--color-gray)' }}
                  >
                    <h6 className="mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-dark)' }}>
                      <svg width="20" height="20" fill="var(--color-navy)" viewBox="0 0 24 24">
                        <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                      </svg>
                      Hướng dẫn quan trọng
                    </h6>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowInstructions(false)}
                    >
                      Ẩn
                    </button>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <h6 style={{ color: 'var(--color-navy)' }}>📋 Quy định thi:</h6>
                        <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                          <li>Không được thoát khỏi trang thi khi đang làm bài</li>
                          <li>Không được sử dụng tài liệu tham khảo</li>
                          <li>Thời gian làm bài được tính từ khi bắt đầu</li>
                          <li>Hệ thống sẽ tự động nộp bài khi hết thời gian</li>
                          <li className="fw-bold text-danger">📹 Bắt buộc phải bật camera trong suốt kỳ thi</li>
                          <li className="fw-bold text-danger">🚫 Không được che camera hoặc rời khỏi khung hình</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: 'var(--color-navy)' }}>⚙️ Chuẩn bị kỹ thuật:</h6>
                        <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                          <li>Đảm bảo kết nối internet ổn định</li>
                          <li>Sử dụng trình duyệt Chrome hoặc Firefox</li>
                          <li>Tắt các ứng dụng không cần thiết</li>
                          <li>Chuẩn bị dự phòng nguồn điện</li>
                          <li className="fw-bold text-primary">📹 Kiểm tra camera và đảm bảo ánh sáng đủ</li>
                          <li className="fw-bold text-primary">🎯 Ngồi ở vị trí cố định trước camera</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-top">
                      <h6 style={{ color: '#dc3545' }}>🚫 Những việc KHÔNG được phép:</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                            <li>Che camera hoặc tắt camera</li>
                            <li>Rời khỏi khung hình camera</li>
                            <li>Có người khác trong khung hình</li>
                            <li>Chuyển sang tab/ứng dụng khác</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                            <li>Sử dụng điện thoại di động</li>
                            <li>Nói chuyện với người khác</li>
                            <li>Sử dụng tài liệu tham khảo</li>
                            <li>Gian lận dưới mọi hình thức</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Webcam Requirements Alert */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="alert alert-warning mb-0">
                        <h6 style={{ color: '#856404' }}>📹 YÊU CẦU CAMERA QUAN TRỌNG:</h6>
                        <ul className="small mb-0" style={{ color: '#856404' }}>
                          <li>Camera phải hoạt động liên tục trong suốt kỳ thi</li>
                          <li>Hệ thống sẽ ghi lại toàn bộ quá trình làm bài</li>
                          <li>Mọi vi phạm đều được ghi nhận và báo cáo</li>
                          <li>Bài thi có thể bị hủy nếu vi phạm nghiêm trọng</li>
                        </ul>
                      </div>
                    </div>

                    {/* ...existing quiz notes code... */}
                  </div>
                </div>
              </div>
            )}

            {/* Ready Check với webcam requirement */}
            <div className="text-center mb-4">
              <div 
                className="card border-0 shadow-sm"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div className="card-body p-4">
                  <h6 className="mb-3" style={{ color: 'var(--color-dark)' }}>
                    Xác nhận sẵn sàng
                  </h6>
                  
                  <div className="form-check form-check-inline mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="readyCheck"
                      checked={isReady}
                      onChange={handleReadyCheck}
                    />
                    <label className="form-check-label" htmlFor="readyCheck">
                      Tôi đã đọc và hiểu các quy định, sẵn sàng làm bài thi
                    </label>
                  </div>

                  {/* Webcam Status */}
                  <div className="mb-3">
                    {!webcamReady && (
                      <div className="alert alert-danger">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                        </svg>
                        <strong>Camera chưa sẵn sàng!</strong><br />
                        Bạn phải cấp quyền truy cập camera để tham gia thi.
                        {webcamError && (
                          <><br /><small>Lỗi: {webcamError}</small></>
                        )}
                      </div>
                    )}

                    {webcamReady && (
                      <div className="alert alert-success">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
                        </svg>
                        <strong>Camera đã sẵn sàng!</strong><br />
                        Hệ thống giám sát đã được kích hoạt.
                      </div>
                    )}
                  </div>
                  
                  {canStartNow && isReady && (
                    <div className="mt-3">
                      <button 
                        className="btn btn-lg d-flex align-items-center gap-2 mx-auto"
                        style={{ 
                          backgroundColor: 'var(--color-green)',
                          color: 'var(--color-white)'
                        }}
                        onClick={handleStartEarly}
                      >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                        </svg>
                        Bắt đầu thi ngay
                      </button>
                      <small className="text-muted mt-2 d-block">
                        (Camera sẽ ghi hình khi bắt đầu thi)
                      </small>
                    </div>
                  )}

                  {!webcamReady && (
                    <div className="alert alert-info mt-3">
                      ⚠️ Bạn không thể bắt đầu thi khi chưa cấp quyền camera.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-center">
              {timeUntilStart > 300 && (
                <div className="alert alert-info">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                  </svg>
                  Vui lòng chờ đến thời gian bắt đầu. Bạn có thể vào thi sớm 5 phút trước giờ.
                </div>
              )}
              
              {timeUntilStart <= 300 && timeUntilStart > 0 && (
                <div className="alert alert-warning">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  Sắp đến giờ thi! Hãy chuẩn bị sẵn sàng.
                </div>
              )}
              
              {timeUntilStart <= 0 && (
                <div className="alert alert-success">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
                  </svg>
                  Đã đến giờ thi! Bạn sẽ được chuyển vào phòng thi ngay lập tức.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}