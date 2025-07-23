import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../data/mockData';
import '../styles/variables.css';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const result = authenticateUser(credentials.username, credentials.password);
      
      if (result.success) {
        // Save token to localStorage
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'var(--color-gray)' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div 
              className="card border-0 shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-white)',
                borderRadius: '20px'
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Header Section */}
                <header className="text-center mb-4">
                  <h1 
                    className="display-6 fw-bold mb-3"
                    style={{ color: 'var(--color-dark)' }}
                  >
                    Let's Sign you in
                  </h1>
                  <p 
                    className="h5 mb-0"
                    style={{ color: 'var(--color-dark)', lineHeight: '1.4' }}
                  >
                    Welcome Back,<br />
                    You have been missed
                  </p>
                </header>

                {/* Demo Accounts Info */}
                <div className="alert alert-info mb-4" style={{ fontSize: '14px' }}>
                  <strong>Demo Accounts:</strong><br />
                  Student: student1 / 123456<br />
                  Admin: admin / admin123
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* Username Field */}
                  <div className="mb-3">
                    <div className="position-relative">
                      <input
                        id="username"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Email, phone & username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          username: e.target.value
                        })}
                        style={{ 
                          borderColor: 'var(--input-border)',
                          fontSize: '16px',
                          padding: '1rem 1.25rem',
                          borderRadius: '8px'
                        }}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <div className="input-group">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          password: e.target.value
                        })}
                        style={{ 
                          borderColor: 'var(--input-border)',
                          fontSize: '16px',
                          padding: '1rem 1.25rem',
                          borderRadius: '8px 0 0 8px'
                        }}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                          borderColor: 'var(--input-border)',
                          borderRadius: '0 8px 8px 0'
                        }}
                        disabled={loading}
                      >
                        <svg width="16" height="16" fill="var(--color-navy)" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                          ) : (
                            <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-end mb-3">
                    <a 
                      href="#" 
                      className="text-decoration-none"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      Forgot Password ?
                    </a>
                  </div>

                  {/* Sign In Button */}
                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      className="btn btn-lg fw-medium"
                      style={{ 
                        backgroundColor: 'var(--color-navy)',
                        borderColor: 'var(--color-navy)',
                        color: 'var(--color-white)',
                        padding: '0.875rem',
                        borderRadius: '8px'
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang đăng nhập...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </div>
                </form>

                {/* Social Sign In Section - Bỏ qua phần này để đơn giản */}
                
                {/* Footer */}
                <footer className="text-center">
                  <p 
                    className="mb-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Don't have an account ?{' '}
                    <a 
                      href="#" 
                      className="fw-bold text-decoration-none"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      Register Now
                    </a>
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}