import { useState } from 'react';
import '../styles/variables.css';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
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
                    >
                      Sign in
                    </button>
                  </div>
                </form>

                {/* Social Sign In Section */}
                <div className="text-center">
                  {/* Divider */}
                  <div className="d-flex align-items-center mb-4">
                    <hr className="flex-grow-1" style={{ borderColor: 'var(--input-border)' }} />
                    <span 
                      className="px-3 fw-medium"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      or
                    </span>
                    <hr className="flex-grow-1" style={{ borderColor: 'var(--input-border)' }} />
                  </div>

                  {/* Social Buttons */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '50px', 
                        height: '50px',
                        borderRadius: '12px',
                        borderColor: 'var(--input-border)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '50px', 
                        height: '50px',
                        borderRadius: '12px',
                        borderColor: 'var(--input-border)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '50px', 
                        height: '50px',
                        borderRadius: '12px',
                        borderColor: 'var(--input-border)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}