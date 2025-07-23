import { useState, useEffect } from 'react';
import { getQuizCalendar } from '../data/mockData';

export default function Calendar({ onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quizDates, setQuizDates] = useState({});

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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
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
        width: '350px',
        zIndex: 1050,
        top: '100%',
        right: '0'
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
                    className="position-relative d-flex align-items-center justify-content-center"
                    style={{ 
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: quizDates[day] ? 'rgba(34, 40, 72, 0.1)' : 'transparent',
                      cursor: quizDates[day] ? 'pointer' : 'default'
                    }}
                    title={quizDates[day] ? `${quizDates[day].length} kỳ thi` : ''}
                  >
                    <span 
                      className="small"
                      style={{ 
                        color: quizDates[day] ? 'var(--color-navy)' : 'var(--color-dark)',
                        fontWeight: quizDates[day] ? 'bold' : 'normal'
                      }}
                    >
                      {day}
                    </span>
                    
                    {/* Quiz indicators */}
                    {quizDates[day] && (
                      <div className="position-absolute" style={{ bottom: '2px', right: '2px' }}>
                        <div className="d-flex gap-1">
                          {quizDates[day].slice(0, 3).map((quiz, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(quiz.currentStatus.status)
                              }}
                            />
                          ))}
                          {quizDates[day].length > 3 && (
                            <div
                              style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-dark)'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-3 pt-3 border-top">
            <small className="fw-bold d-block mb-2" style={{ color: 'var(--color-dark)' }}>
              Chú thích:
            </small>
            <div className="d-flex flex-wrap gap-2">
              <div className="d-flex align-items-center gap-1">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></div>
                <small style={{ color: 'var(--text-secondary)' }}>Đang diễn ra</small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff8c00' }}></div>
                <small style={{ color: 'var(--text-secondary)' }}>Sắp bắt đầu</small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-navy)' }}></div>
                <small style={{ color: 'var(--text-secondary)' }}>Sắp tới</small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6c757d' }}></div>
                <small style={{ color: 'var(--text-secondary)' }}>Đã kết thúc</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}