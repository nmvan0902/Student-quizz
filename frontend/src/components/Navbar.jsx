import { useState, useEffect } from 'react';
import { getCurrentUser, getQuizStats } from '../data/mockData';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [quizStats, setQuizStats] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const stats = getQuizStats();
    setQuizStats(stats);
    
    // Cập nhật stats mỗi phút
    const interval = setInterval(() => {
      setQuizStats(getQuizStats());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Bài thi mới',
      message: 'Bài thi Toán học đã được cập nhật',
      time: '5 phút trước',
      read: false
    },
    {
      id: 2,
      title: 'Kỳ thi sắp bắt đầu',
      message: 'Bài thi Tiếng Anh sẽ bắt đầu trong 10 phút',
      time: '2 phút trước',
      read: false
    },
    {
      id: 3,
      title: 'Điểm số',
      message: 'Bạn đã hoàn thành bài thi Văn học',
      time: '1 giờ trước',
      read: true
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <nav 
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: 'var(--color-white)' }}
    >
      <div className="container-fluid px-4">
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle me-3"
            style={{ 
              width: '40px', 
              height: '40px',
              backgroundColor: 'var(--color-navy)'
            }}
          >
            <svg 
              width="20" 
              height="20" 
              fill="var(--color-white)" 
              viewBox="0 0 24 24"
            >
              <path d="M12 3L1 9L12 15L21 9V16H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <span 
            className="fw-bold fs-5"
            style={{ color: 'var(--color-navy)' }}
          >
            Student Quiz
          </span>
        </div>

        {/* Right side items */}
        <div className="d-flex align-items-center gap-3">
          {/* Calendar with quiz count - Badge lớn hơn */}
          <div className="position-relative">
            <button 
              className="btn btn-link p-2 position-relative"
              style={{ color: 'var(--color-navy)' }}
              title={`${quizStats.todayOngoing} kỳ thi đang diễn ra hôm nay`}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M7 10H12V15H7"/>
              </svg>
              {quizStats.todayOngoing > 0 && (
                <span 
                  className="position-absolute badge rounded-pill fw-bold"
                  style={{ 
                    backgroundColor: 'var(--color-green)',
                    color: 'var(--color-white)',
                    fontSize: '0.75rem',
                    padding: '0.35em 0.65em',
                    top: '-5px',
                    right: '-5px',
                    minWidth: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {quizStats.todayOngoing}
                </span>
              )}
            </button>
          </div>

          {/* Notification Bell */}
          <div className="position-relative">
            <button 
              className="btn btn-link p-2 position-relative"
              style={{ color: 'var(--color-navy)' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22M18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"/>
              </svg>
              {notifications.some(n => !n.read) && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                  style={{ width: '8px', height: '8px' }}
                >
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="position-absolute end-0 mt-2 shadow-lg border-0 rounded-3"
                style={{ 
                  backgroundColor: 'var(--color-white)',
                  width: '320px',
                  zIndex: 1050
                }}
              >
                <div className="card border-0">
                  <div 
                    className="card-header border-0 fw-bold"
                    style={{ backgroundColor: 'var(--color-gray)', color: 'var(--color-dark)' }}
                  >
                    Thông báo
                  </div>
                  <div className="card-body p-0">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`d-flex p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                      >
                        <div className="flex-grow-1">
                          <h6 
                            className="mb-1"
                            style={{ color: 'var(--color-dark)' }}
                          >
                            {notification.title}
                          </h6>
                          <p 
                            className="mb-1 small"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {notification.message}
                          </p>
                          <small style={{ color: 'var(--text-secondary)' }}>
                            {notification.time}
                          </small>
                        </div>
                        {!notification.read && (
                          <div>
                            <span 
                              className="badge rounded-pill"
                              style={{ backgroundColor: 'var(--color-green)' }}
                            >
                              Mới
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="card-footer border-0 text-center">
                    <a 
                      href="#" 
                      className="text-decoration-none"
                      style={{ color: 'var(--color-navy)' }}
                    >
                      Xem tất cả
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="position-relative">
            <button 
              className="btn btn-link p-0 d-flex align-items-center"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  backgroundColor: 'var(--color-green)',
                  color: 'var(--color-white)'
                }}
              >
                <span className="fw-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ms-2 text-start d-none d-md-block">
                <div 
                  className="fw-medium"
                  style={{ color: 'var(--color-dark)', fontSize: '14px' }}
                >
                  {user.fullName}
                </div>
                <div 
                  className="small"
                  style={{ color: 'var(--text-secondary)', fontSize: '12px' }}
                >
                  Sinh viên
                </div>
              </div>
              <svg 
                width="12" 
                height="12" 
                fill="var(--color-navy)" 
                viewBox="0 0 24 24"
                className="ms-2"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div 
                className="position-absolute end-0 mt-2 shadow-lg border-0 rounded-3"
                style={{ 
                  backgroundColor: 'var(--color-white)',
                  width: '200px',
                  zIndex: 1050
                }}
              >
                <div className="card border-0">
                  <div className="card-body p-2">
                    <a 
                      href="#" 
                      className="dropdown-item d-flex align-items-center p-2 rounded"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                      </svg>
                      Hồ sơ cá nhân
                    </a>
                    <a 
                      href="#" 
                      className="dropdown-item d-flex align-items-center p-2 rounded"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                        <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                      </svg>
                      Cài đặt
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center p-2 rounded text-danger"
                      style={{ border: 'none', background: 'none' }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                        <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}