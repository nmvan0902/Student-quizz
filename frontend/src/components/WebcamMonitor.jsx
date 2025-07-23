import { useState, useEffect, useRef } from 'react';

export default function WebcamMonitor({ onWebcamReady, onWebcamError, isQuizStarted = false }) {
  const [webcamStatus, setWebcamStatus] = useState('checking'); // checking, granted, denied, error
  const [isRecording, setIsRecording] = useState(false);
  const [violations, setViolations] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    initializeWebcam();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeWebcam = async () => {
    try {
      setWebcamStatus('checking');
      
      // Yêu cầu quyền truy cập camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setWebcamStatus('granted');
      onWebcamReady?.(true);

      // Bắt đầu ghi hình nếu quiz đã bắt đầu
      if (isQuizStarted) {
        startRecording();
      }

    } catch (error) {
      console.error('Webcam error:', error);
      setWebcamStatus('denied');
      onWebcamError?.(error.message);
    }
  };

  const startRecording = () => {
    if (!streamRef.current || isRecording) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Có thể gửi data lên server để lưu trữ
          console.log('Recording chunk:', event.data);
        }
      };

      mediaRecorder.start(5000); // Ghi mỗi 5 giây một chunk
      setIsRecording(true);
      
    } catch (error) {
      console.error('Recording error:', error);
      addViolation('Không thể bắt đầu ghi hình');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addViolation = (reason) => {
    const violation = {
      id: Date.now(),
      reason,
      timestamp: new Date().toISOString(),
      screenshot: captureScreenshot()
    };
    
    setViolations(prev => [...prev, violation]);
    
    // Thông báo vi phạm cho parent component
    onWebcamError?.(`Vi phạm giám sát: ${reason}`);
  };

  const captureScreenshot = () => {
    if (!videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Theo dõi sự kiện rời khỏi tab/cửa sổ
  useEffect(() => {
    if (!isQuizStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('Chuyển sang tab/ứng dụng khác');
      }
    };

    const handleBlur = () => {
      addViolation('Mất focus khỏi cửa sổ thi');
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      addViolation('Cố gắng thoát khỏi trang thi');
      return 'Bạn có chắc muốn thoát? Dữ liệu thi sẽ bị mất.';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isQuizStarted]);

  // Kiểm tra webcam có bị che không (đơn giản)
  useEffect(() => {
    if (!isQuizStarted || webcamStatus !== 'granted') return;

    const checkWebcamCoverage = () => {
      if (!videoRef.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(videoRef.current, 0, 0, 100, 100);
      
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;
      
      // Kiểm tra xem có quá nhiều pixel đen không (có thể bị che)
      let darkPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness < 30) darkPixels++;
      }
      
      const darkRatio = darkPixels / (100 * 100);
      if (darkRatio > 0.8) {
        addViolation('Camera có thể bị che hoặc quá tối');
      }
    };

    const interval = setInterval(checkWebcamCoverage, 10000); // Kiểm tra mỗi 10 giây
    return () => clearInterval(interval);
  }, [isQuizStarted, webcamStatus]);

  const retryWebcam = () => {
    initializeWebcam();
  };

  const getStatusIcon = () => {
    switch (webcamStatus) {
      case 'checking':
        return (
          <div className="spinner-border spinner-border-sm text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        );
      case 'granted':
        return (
          <svg width="16" height="16" fill="var(--color-green)" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
          </svg>
        );
      case 'denied':
      case 'error':
        return (
          <svg width="16" height="16" fill="#dc3545" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="webcam-monitor">
      {/* Video Preview */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 d-flex align-items-center gap-2">
            {getStatusIcon()}
            Camera giám sát
            {isRecording && (
              <span className="badge bg-danger d-flex align-items-center gap-1">
                <div 
                  className="rounded-circle"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    animation: 'blink 1s infinite'
                  }}
                />
                REC
              </span>
            )}
          </h6>
          
          {webcamStatus === 'denied' && (
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={retryWebcam}
            >
              Thử lại
            </button>
          )}
        </div>

        <div 
          className="position-relative border rounded"
          style={{ 
            width: '200px', 
            height: '150px',
            backgroundColor: '#f8f9fa'
          }}
        >
          {webcamStatus === 'granted' ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-100 h-100 rounded"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                {webcamStatus === 'checking' && (
                  <>
                    <div className="spinner-border text-primary mb-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <small className="text-muted">Đang kiểm tra camera...</small>
                  </>
                )}
                
                {webcamStatus === 'denied' && (
                  <>
                    <svg width="32" height="32" fill="#dc3545" viewBox="0 0 24 24" className="mb-2">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                    </svg>
                    <small className="text-muted d-block">Camera bị từ chối</small>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {webcamStatus === 'denied' && (
          <div className="alert alert-danger mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
            <strong>⚠️ Cần cấp quyền camera!</strong><br />
            Bạn phải cho phép truy cập camera để tham gia thi.
            <br />
            <small>Hướng dẫn: Nhấn vào biểu tượng camera trên thanh địa chỉ và chọn "Allow"</small>
          </div>
        )}

        {webcamStatus === 'granted' && !isQuizStarted && (
          <div className="alert alert-success mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
            ✅ Camera đã sẵn sàng. Hệ thống sẽ ghi hình khi bạn bắt đầu làm bài.
          </div>
        )}

        {webcamStatus === 'granted' && isQuizStarted && (
          <div className="alert alert-info mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
            📹 Đang ghi hình để giám sát thi. 
            {violations.length > 0 && (
              <span className="text-danger">
                <br />⚠️ Đã ghi nhận {violations.length} vi phạm.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Violations List (nếu có) */}
      {violations.length > 0 && (
        <div className="mt-3">
          <h6 className="text-danger mb-2">⚠️ Vi phạm đã ghi nhận:</h6>
          <div className="list-group list-group-flush">
            {violations.slice(-5).map(violation => (
              <div key={violation.id} className="list-group-item px-0 py-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-danger fw-bold">{violation.reason}</small>
                    <br />
                    <small className="text-muted">
                      {new Date(violation.timestamp).toLocaleTimeString('vi-VN')}
                    </small>
                  </div>
                  {violation.screenshot && (
                    <img 
                      src={violation.screenshot}
                      alt="Vi phạm"
                      style={{ width: '40px', height: '30px', objectFit: 'cover' }}
                      className="rounded border"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}