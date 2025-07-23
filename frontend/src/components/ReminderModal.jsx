import { useState, useEffect } from 'react';
import { setQuizReminder, removeQuizReminder, getQuizReminder } from '../data/mockData';

export default function ReminderModal({ quiz, onClose, onSave }) {
  const [reminderType, setReminderType] = useState('');
  const [minutesBefore, setMinutesBefore] = useState(15);
  const [existingReminder, setExistingReminder] = useState({});

  useEffect(() => {
    const reminder = getQuizReminder(quiz.id);
    setExistingReminder(reminder);
    
    if (reminder.interval) {
      setReminderType('interval');
    } else if (reminder.minutesBefore) {
      setReminderType('before');
      setMinutesBefore(reminder.minutesBefore);
    }
  }, [quiz.id]);

  const handleSave = () => {
    if (reminderType === 'interval') {
      setQuizReminder(quiz.id, 'interval');
    } else if (reminderType === 'before') {
      setQuizReminder(quiz.id, 'before', minutesBefore);
    } else {
      removeQuizReminder(quiz.id);
    }
    
    onSave?.();
    onClose();
  };

  const handleRemove = () => {
    removeQuizReminder(quiz.id);
    onSave?.();
    onClose();
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div 
        className="card border-0 shadow-lg"
        style={{ 
          backgroundColor: 'var(--color-white)',
          width: '400px',
          maxWidth: '90%'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-header border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ color: 'var(--color-dark)' }}>
            Cài đặt nhắc nhở
          </h5>
          <button 
            className="btn btn-link p-0"
            onClick={onClose}
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        
        <div className="card-body">
          <div className="mb-3">
            <h6 style={{ color: 'var(--color-navy)' }}>{quiz.title}</h6>
            <small style={{ color: 'var(--text-secondary)' }}>
              Bắt đầu: {new Date(quiz.startTime).toLocaleString('vi-VN')}
            </small>
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-medium" style={{ color: 'var(--color-dark)' }}>
              Loại nhắc nhở
            </label>
            
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="reminderType"
                id="no-reminder"
                value=""
                checked={reminderType === ''}
                onChange={(e) => setReminderType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="no-reminder">
                Không nhắc nhở
              </label>
            </div>
            
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="reminderType"
                id="interval-reminder"
                value="interval"
                checked={reminderType === 'interval'}
                onChange={(e) => setReminderType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="interval-reminder">
                Nhắc nhở mỗi 15 phút kể từ bây giờ
              </label>
            </div>
            
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="reminderType"
                id="before-reminder"
                value="before"
                checked={reminderType === 'before'}
                onChange={(e) => setReminderType(e.target.value)}
              />
              <label className="form-check-label" htmlFor="before-reminder">
                Nhắc nhở trước kỳ thi
              </label>
            </div>
            
            {reminderType === 'before' && (
              <div className="ms-4">
                <label className="form-label small" style={{ color: 'var(--text-secondary)' }}>
                  Trước bao nhiêu phút:
                </label>
                <select
                  className="form-select form-select-sm"
                  value={minutesBefore}
                  onChange={(e) => setMinutesBefore(Number(e.target.value))}
                  style={{ width: '120px' }}
                >
                  <option value={5}>5 phút</option>
                  <option value={10}>10 phút</option>
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={60}>1 giờ</option>
                </select>
              </div>
            )}
          </div>
          
          {(existingReminder.interval || existingReminder.minutesBefore) && (
            <div 
              className="alert alert-info d-flex align-items-center"
              style={{ fontSize: '14px' }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <div>
                Bạn đã có nhắc nhở cho kỳ thi này:
                {existingReminder.interval && <div>• Mỗi 15 phút</div>}
                {existingReminder.minutesBefore && <div>• Trước {existingReminder.minutesBefore} phút</div>}
              </div>
            </div>
          )}
        </div>
        
        <div className="card-footer border-0 d-flex gap-2">
          {(existingReminder.interval || existingReminder.minutesBefore) && (
            <button
              className="btn btn-outline-danger"
              onClick={handleRemove}
            >
              Xóa nhắc nhở
            </button>
          )}
          <button
            className="btn flex-fill"
            style={{ 
              backgroundColor: 'var(--color-green)',
              color: 'var(--color-white)'
            }}
            onClick={handleSave}
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}