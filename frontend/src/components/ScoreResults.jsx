import { useState, useEffect } from 'react';
import { getStudentQuizResults, markResultAsViewed, getCurrentUser } from '../data/mockData';

export default function ScoreResults() {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const studentResults = getStudentQuizResults(currentUser.id);
      setResults(studentResults);
    }
  }, []);

  const handleViewResult = (resultId) => {
    markResultAsViewed(resultId);
    // Cập nhật state để reflect thay đổi
    setResults(prev => 
      prev.map(result => 
        result.id === resultId 
          ? { ...result, viewedAt: new Date() }
          : result
      )
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--color-green)';
    if (score >= 80) return '#ff8c00';
    if (score >= 70) return 'var(--color-navy)';
    return '#dc3545';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Giỏi';
    if (score >= 70) return 'Khá';
    if (score >= 60) return 'Trung bình';
    return 'Yếu';
  };

  if (!results.length) {
    return (
      <div className="text-center py-5">
        <svg width="64" height="64" fill="var(--text-secondary)" viewBox="0 0 24 24" className="mb-3">
          <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8L6,7L4,9M4,19H8L6,17L4,19M4,14H8L6,12L4,14Z"/>
        </svg>
        <h5 style={{ color: 'var(--color-dark)' }}>Chưa có kết quả thi</h5>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bạn chưa hoàn thành bài thi nào
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 style={{ color: 'var(--color-dark)' }}>
              Kết quả thi của bạn
            </h3>
            <span className="badge bg-secondary">
              {results.length} bài thi
            </span>
          </div>

          <div className="row">
            {results.map(result => (
              <div key={result.id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className="card border-0 shadow-sm h-100 position-relative"
                  style={{ backgroundColor: 'var(--color-white)' }}
                >
                  {/* New badge for unviewed results */}
                  {!result.viewedAt && (
                    <div 
                      className="position-absolute badge rounded-pill"
                      style={{ 
                        top: '10px', 
                        right: '10px',
                        backgroundColor: 'var(--color-green)',
                        zIndex: 10
                      }}
                    >
                      Mới
                    </div>
                  )}
                  
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '80px', 
                          height: '80px',
                          backgroundColor: getScoreColor(result.score),
                          color: 'var(--color-white)'
                        }}
                      >
                        <div className="text-center">
                          <div className="h4 mb-0 fw-bold">{result.score}</div>
                          <small>điểm</small>
                        </div>
                      </div>
                      
                      <h5 
                        className="card-title mb-2"
                        style={{ color: 'var(--color-navy)' }}
                      >
                        {result.quiz?.title}
                      </h5>
                      
                      <span 
                        className="badge rounded-pill"
                        style={{ backgroundColor: getScoreColor(result.score) }}
                      >
                        {getScoreGrade(result.score)}
                      </span>
                    </div>
                    
                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="small" style={{ color: 'var(--text-secondary)' }}>
                          Đúng
                        </div>
                        <div className="fw-bold" style={{ color: 'var(--color-green)' }}>
                          {result.correctAnswers}/{result.totalQuestions}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="small" style={{ color: 'var(--text-secondary)' }}>
                          Thời gian
                        </div>
                        <div className="fw-bold" style={{ color: 'var(--color-navy)' }}>
                          {result.timeSpent}p
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="small" style={{ color: 'var(--text-secondary)' }}>
                          Hoàn thành
                        </div>
                        <div className="fw-bold" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(result.completedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-grid">
                      {!result.viewedAt ? (
                        <button
                          className="btn"
                          style={{ 
                            backgroundColor: 'var(--color-green)',
                            color: 'var(--color-white)'
                          }}
                          onClick={() => handleViewResult(result.id)}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                          </svg>
                          Xem chi tiết
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {/* Xem lại chi tiết */}}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                          </svg>
                          Xem lại
                        </button>
                      )}
                    </div>
                    
                    {result.viewedAt && (
                      <div className="mt-2 text-center">
                        <small style={{ color: 'var(--text-secondary)' }}>
                          Đã xem: {new Date(result.viewedAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}