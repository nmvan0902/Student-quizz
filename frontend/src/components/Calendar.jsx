import { useState, useEffect } from 'react';
import { getQuizCalendar } from '../data/mockData';

export default function Calendar({ onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quizDates, setQuizDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendar = getQuizCalendar(year, month);
    setQuizDates(calendar);
  }, [currentDate]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Thêm ngày trống cho các ngày của tháng trước
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'var(--color-green)';
      case 'starting_soon': return '#ff8c00';
      case 'upcoming': return 'var(--color-navy)';
      case 'completed': return '#6c757d';
      default: return 'var(--color-navy)';
    }
  };

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
        style={{ backgroundColor: badge.color, fontSize: '0.7rem' }}
      >
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setShowDayDetail(false);
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    if (quizDates[day]) {
      setSelectedDay(day);
      setShowDayDetail(true);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div 
      className="position-absolute shadow-lg border-0 rounded-3"
      style={{ 
        backgroundColor: 'var(--color-white)',
        width: showDayDetail ? '450px' : '320px',
        zIndex: 1050,
        top: '100%',
        right: '0',
        transition: 'width 0.3s ease'
      }}
    >
      <div className="card border-0">
        <div 
          className="card-header d-flex justify-content-between align-items-center border-0"
          style={{ backgroundColor: 'var(--color-gray)' }}
        >
          <button 
            className="btn btn-sm btn-link p-0"
            onClick={() => navigateMonth(-1)}
            style={{ color: 'var(--color-navy)' }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
            </svg>
          </button>
          
          <h6 className="mb-0 fw-bold" style={{ color: 'var(--color-dark)' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h6>
          
          <button 
            className="btn btn-sm btn-link p-0"
            onClick={() => navigateMonth(1)}
            style={{ color: 'var(--color-navy)' }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>
        </div>
        
        <div className="card-body p-3">
          <div className="row">
            {/* Calendar Section */}
            <div className={showDayDetail ? 'col-7' : 'col-12'}>
              {/* Day headers */}
              <div className="row text-center mb-2">
                {dayNames.map(day => (
                  <div key={day} className="col">
                    <small className="fw-bold" style={{ color: 'var(--text-secondary)' }}>
                      {day}
                    </small>
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="row">
                {days.map((day, index) => (
                  <div key={index} className="col p-1">
                    {day && (
                      <div 
                        className="position-relative d-flex align-items-center justify-content-center calendar-day"
                        style={{ 
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: isToday(day) 
                            ? 'var(--color-green)' 
                            : quizDates[day] 
                              ? 'rgba(34, 40, 72, 0.1)' 
                              : 'transparent',
                          cursor: quizDates[day] ? 'pointer' : 'default',
                          border: selectedDay === day ? '2px solid var(--color-navy)' : 'none'
                        }}
                        onClick={() => handleDayClick(day)}
                        title={quizDates[day] ? `${quizDates[day].length} kỳ thi - Nhấn để xem chi tiết` : ''}
                      >
                        <span 
                          className="small"
                          style={{ 
                            color: isToday(day) 
                              ? 'var(--color-white)'
                              : quizDates[day] 
                                ? 'var(--color-navy)' 
                                : 'var(--color-dark)',
                            fontWeight: quizDates[day] || isToday(day) ? 'bold' : 'normal'
                          }}
                        >
                          {day}
                        </span>
                        
                        {/* Quiz indicator dot */}
                        {quizDates[day] && !isToday(day) && (
                          <div 
                            className="position-absolute"
                            style={{ 
                              bottom: '2px', 
                              right: '2px',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-green)'
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Detail Section */}
            {showDayDetail && selectedDay && quizDates[selectedDay] && (
              <div className="col-5 border-start ps-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold" style={{ color: 'var(--color-navy)' }}>
                    Ngày {selectedDay}
                  </h6>
                  <button 
                    className="btn btn-sm btn-link p-0"
                    onClick={() => setShowDayDetail(false)}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="mb-2">
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {quizDates[selectedDay].length} kỳ thi
                  </small>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {quizDates[selectedDay].map(quiz => (
                    <div 
                      key={quiz.id} 
                      className="mb-2 p-2 rounded"
                      style={{ backgroundColor: 'var(--color-gray)' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 
                          className="mb-0 small fw-bold"
                          style={{ color: 'var(--color-navy)', fontSize: '0.8rem' }}
                        >
                          {quiz.title}
                        </h6>
                        {getStatusBadge(quiz.currentStatus.status)}
                      </div>
                      
                      <p 
                        className="mb-1 small"
                        style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '0.75rem',
                          lineHeight: '1.2'
                        }}
                      >
                        {quiz.description}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className="me-1">
                            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                          </svg>
                          {new Date(quiz.startTime).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {quiz.duration}p
                        </small>
                        
                        {quiz.currentStatus.canStart && (
                          <button 
                            className="btn btn-sm py-0 px-2"
                            style={{ 
                              backgroundColor: quiz.currentStatus.status === 'ongoing' 
                                ? 'var(--color-green)' 
                                : 'var(--color-navy)',
                              color: 'var(--color-white)',
                              fontSize: '0.7rem'
                            }}
                            onClick={() => {
                              window.location.href = `/quiz/${quiz.id}`;
                            }}
                          >
                            {quiz.currentStatus.status === 'ongoing' ? 'Vào thi' : 'Sẵn sàng'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Legend - chỉ hiện khi không có detail */}
          {!showDayDetail && (
            <div className="mt-3 pt-3 border-top">
              <small className="fw-bold d-block mb-2" style={{ color: 'var(--color-dark)' }}>
                Chú thích:
              </small>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div className="d-flex align-items-center gap-1">
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-green)' 
                  }}></div>
                  <small style={{ color: 'var(--text-secondary)' }}>Có kỳ thi</small>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '4px', 
                    backgroundColor: 'var(--color-green)' 
                  }}></div>
                  <small style={{ color: 'var(--text-secondary)' }}>Hôm nay</small>
                </div>
                <small style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  💡 Nhấn vào ngày để xem chi tiết
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}