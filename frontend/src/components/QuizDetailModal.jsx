import { useState } from 'react';
import { getQuizStatus } from '../data/mockData';

export default function QuizDetailModal({ quiz, onClose }) {
  const [showInstructions, setShowInstructions] = useState(true);

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!quiz) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" style={{ color: 'var(--color-navy)' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Chi tiết bài thi
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Thông tin chính */}
            <div className="mb-4">
              <div className="card border-0" style={{ backgroundColor: 'var(--color-gray)' }}>
                <div className="card-body p-3">
                  <h4 className="mb-2" style={{ color: 'var(--color-navy)' }}>
                    {quiz.title}
                  </h4>
                  <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                    {quiz.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* Thông tin thời gian */}
              <div className="col-md-6">
                <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-dark)' }}>
                  <svg width="16" height="16" fill="var(--color-green)" viewBox="0 0 24 24">
                    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M7 10H12V15H7"/>
                  </svg>
                  Thời gian
                </h6>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Ngày thi:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {formatDate(quiz.startTime)}
                  </strong>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Giờ bắt đầu:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {formatTime(quiz.startTime)}
                  </strong>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Giờ kết thúc:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {formatTime(quiz.endTime)}
                  </strong>
                </div>
              </div>

              {/* Thông tin bài thi */}
              <div className="col-md-6">
                <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-dark)' }}>
                  <svg width="16" height="16" fill="var(--color-navy)" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Thông tin bài thi
                </h6>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Thời gian làm bài:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {quiz.duration} phút
                  </strong>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Số câu hỏi:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {quiz.totalQuestions} câu
                  </strong>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Đối tượng:</small>
                  <strong style={{ color: 'var(--color-dark)' }}>
                    {quiz.targetClass || 'Tất cả sinh viên'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quy định và hướng dẫn */}
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
                    Quy định và hướng dẫn quan trọng
                  </h6>
                  {showInstructions && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowInstructions(false)}
                    >
                      Ẩn
                    </button>
                  )}
                  {!showInstructions && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowInstructions(true)}
                    >
                      Hiện
                    </button>
                  )}
                </div>
                
                {showInstructions && (
                  <div className="card-body p-4">
                    {/* Camera Requirement Alert */}
                    <div className="alert alert-warning mb-3">
                      <h6 style={{ color: '#856404' }}>📹 YÊU CẦU BẮT BUỘC: CAMERA GIÁM SÁT</h6>
                      <ul className="small mb-0" style={{ color: '#856404' }}>
                        <li><strong>Bắt buộc bật camera trong suốt kỳ thi</strong></li>
                        <li>Hệ thống sẽ ghi hình toàn bộ quá trình làm bài</li>
                        <li>Không được che camera hoặc rời khỏi khung hình</li>
                        <li>Vi phạm sẽ được ghi nhận và có thể dẫn đến hủy bài thi</li>
                      </ul>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <h6 style={{ color: 'var(--color-navy)' }}>📋 Quy định thi:</h6>
                        <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                          <li>Không được thoát khỏi trang thi khi đang làm bài</li>
                          <li>Không được sử dụng tài liệu tham khảo</li>
                          <li>Thời gian làm bài được tính từ khi bắt đầu</li>
                          <li>Hệ thống sẽ tự động nộp bài khi hết thời gian</li>
                          <li>Không được reload trang hoặc back lại trong khi thi</li>
                          <li>Chỉ có một lần làm bài, không thể làm lại</li>
                          <li className="fw-bold text-danger">📹 Camera phải hoạt động liên tục</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: 'var(--color-navy)' }}>⚙️ Chuẩn bị kỹ thuật:</h6>
                        <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                          <li>Đảm bảo kết nối internet ổn định</li>
                          <li>Sử dụng trình duyệt Chrome hoặc Firefox</li>
                          <li>Tắt các ứng dụng không cần thiết</li>
                          <li>Chuẩn bị dự phòng nguồn điện</li>
                          <li className="fw-bold text-primary">📹 Kiểm tra camera hoạt động tốt</li>
                          <li className="fw-bold text-primary">💡 Đảm bảo ánh sáng đủ sáng</li>
                          <li>Đóng tất cả tab khác của trình duyệt</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-top">
                      <h6 style={{ color: '#dc3545' }}>🚫 Những việc KHÔNG được phép:</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                            <li className="fw-bold text-danger">Tắt hoặc che camera</li>
                            <li className="fw-bold text-danger">Rời khỏi khung hình camera</li>
                            <li className="fw-bold text-danger">Có người khác xuất hiện</li>
                            <li>Sao chép (Copy) nội dung câu hỏi</li>
                            <li>Chụp màn hình bài thi</li>
                            <li>Trao đổi với người khác trong lúc thi</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                            <li>Mở tab mới để tra cứu</li>
                            <li>Sử dụng phần mềm hỗ trợ</li>
                            <li>Nhờ người khác làm thay</li>
                            <li>Gian lận dưới mọi hình thức</li>
                            <li>Sử dụng điện thoại di động</li>
                            <li>Chuyển sang ứng dụng khác</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {quiz.notes && (
                      <div className="mt-3 pt-3 border-top">
                        <h6 style={{ color: '#ff8c00' }}>⚠️ Lưu ý đặc biệt cho bài thi này:</h6>
                        <div className="alert alert-warning mb-0">
                          {quiz.notes.split('\n').map((note, index) => (
                            <p key={index} className="mb-1 small">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lưu ý đặc biệt cũ - ẩn nếu đã có trong quy định */}
            {quiz.notes && !showInstructions && (
              <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--color-dark)' }}>
                  <svg width="16" height="16" fill="#ff8c00" viewBox="0 0 24 24">
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                  </svg>
                  Lưu ý quan trọng
                </h6>
                
                <div 
                  className="alert alert-warning d-flex align-items-start gap-2"
                  style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}
                >
                  <svg width="16" height="16" fill="#ff8c00" viewBox="0 0 24 24" className="mt-1">
                    <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                  <div>
                    {quiz.notes.split('\n').map((note, index) => (
                      <p key={index} className="mb-1 small" style={{ color: '#856404' }}>
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trạng thái hiện tại */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center p-3 rounded" 
                   style={{ backgroundColor: 'var(--color-gray)' }}>
                <div>
                  <small className="text-muted d-block">Trạng thái hiện tại:</small>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    {quiz.currentStatus?.status === 'ongoing' && (
                      <span className="badge bg-success d-flex align-items-center gap-1">
                        🔴 Đang diễn ra
                      </span>
                    )}
                    {quiz.currentStatus?.status === 'starting_soon' && (
                      <span className="badge d-flex align-items-center gap-1" style={{backgroundColor: '#ff8c00'}}>
                        ⏰ Sắp bắt đầu
                      </span>
                    )}
                    {quiz.currentStatus?.status === 'upcoming' && (
                      <span className="badge bg-primary d-flex align-items-center gap-1">
                        📅 Sắp tới
                      </span>
                    )}
                    {quiz.currentStatus?.status === 'completed' && (
                      <span className="badge bg-secondary d-flex align-items-center gap-1">
                        ✅ Đã kết thúc
                      </span>
                    )}
                    <span style={{ color: 'var(--color-dark)' }}>
                      {quiz.currentStatus?.timeLeft}
                    </span>
                  </div>
                </div>
                
                {quiz.currentStatus?.canStart && (
                  <button 
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => {
                      const targetUrl = quiz.currentStatus.status === 'ongoing' 
                        ? `/quiz/${quiz.id}` 
                        : `/waiting-room/${quiz.id}`;
                      window.location.href = targetUrl;
                    }}
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                    {quiz.currentStatus.status === 'ongoing' ? 'Tham gia ngay' : 'Vào phòng chờ'}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}