// Mock data for authentication
export const mockUsers = [
  {
    id: 1,
    username: 'student1',
    email: 'student1@example.com',
    password: '123456',
    role: 'student',
    fullName: 'Nguyễn Văn A'
  },
  {
    id: 2,
    username: 'student2', 
    email: 'student2@example.com',
    password: 'password',
    role: 'student',
    fullName: 'Trần Thị B'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com', 
    password: 'admin123',
    role: 'admin',
    fullName: 'Admin User'
  }
];

// Mock quiz results data
export const mockQuizResults = [
  {
    id: 1,
    quizId: 4,
    userId: 1,
    score: 85,
    totalQuestions: 30,
    correctAnswers: 26,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    viewedAt: null, // chưa xem
    timeSpent: 42 // phút
  },
  {
    id: 2,
    quizId: 5,
    userId: 1,
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // đã xem
    timeSpent: 38
  },
  {
    id: 3,
    quizId: 6,
    userId: 1,
    score: 78,
    totalQuestions: 20,
    correctAnswers: 16,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    viewedAt: null, // chưa xem
    timeSpent: 35
  }
];

// Mock quiz data với thời gian cụ thể
export const mockQuizzes = [
  {
    id: 1,
    title: 'Bài thi Toán học cơ bản',
    description: 'Kiểm tra kiến thức toán học lớp 12',
    duration: 60,
    totalQuestions: 20,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: 'upcoming',
    questions: [
      {
        id: 1,
        question: 'Tính đạo hàm của hàm số f(x) = x² + 3x - 2?',
        options: [
          'f\'(x) = 2x + 3',
          'f\'(x) = x + 3', 
          'f\'(x) = 2x - 3',
          'f\'(x) = x² + 3'
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: 'Giải phương trình x² - 5x + 6 = 0?',
        options: [
          'x = 1, x = 6',
          'x = 2, x = 3',
          'x = -2, x = -3', 
          'x = 1, x = -6'
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: 'Tính giới hạn lim(x→2) (x² - 4)/(x - 2)?',
        options: [
          '0',
          '2',
          '4',
          'Không tồn tại'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: 'Bài thi Văn học',
    description: 'Kiểm tra kiến thức văn học Việt Nam',
    duration: 90,
    totalQuestions: 15,
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    endTime: new Date(Date.now() + 60 * 60 * 1000),
    status: 'ongoing',
    questions: [
      {
        id: 1,
        question: 'Tác giả của tác phẩm "Số đỏ" là ai?',
        options: [
          'Nguyễn Du',
          'Vũ Trọng Phụng',
          'Nam Cao',
          'Ngô Tất Tố'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 3,
    title: 'Bài thi Tiếng Anh',
    description: 'Kiểm tra khả năng đọc hiểu tiếng Anh',
    duration: 75,
    totalQuestions: 25,
    startTime: new Date(Date.now() + 10 * 60 * 1000),
    endTime: new Date(Date.now() + 85 * 60 * 1000),
    status: 'starting_soon',
    questions: []
  },
  {
    id: 4,
    title: 'Bài thi Lịch sử',
    description: 'Kiểm tra kiến thức lịch sử Việt Nam',
    duration: 45,
    totalQuestions: 30,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    status: 'completed',
    questions: []
  },
  {
    id: 5,
    title: 'Bài thi Vật lý',
    description: 'Kiểm tra kiến thức vật lý cơ bản',
    duration: 60,
    totalQuestions: 25,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: 'completed',
    questions: []
  },
  {
    id: 6,
    title: 'Bài thi Hóa học',
    description: 'Kiểm tra kiến thức hóa học lớp 12',
    duration: 50,
    totalQuestions: 20,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
    status: 'completed',
    questions: []
  },
  // Thêm quiz cho tương lai để test calendar
  {
    id: 7,
    title: 'Bài thi Sinh học',
    description: 'Kiểm tra kiến thức sinh học',
    duration: 45,
    totalQuestions: 20,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // ngày mai
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    status: 'upcoming',
    questions: []
  },
  {
    id: 8,
    title: 'Bài thi Địa lý',
    description: 'Kiểm tra kiến thức địa lý Việt Nam',
    duration: 60,
    totalQuestions: 25,
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày nữa
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: 'upcoming',
    questions: []
  }
];

// Notification reminders storage
let notificationReminders = JSON.parse(localStorage.getItem('quizReminders') || '{}');

// Helper functions
export const getQuizStatus = (quiz) => {
  const now = new Date();
  const startTime = new Date(quiz.startTime);
  const endTime = new Date(quiz.endTime);
  
  if (now < startTime) {
    const timeDiff = startTime - now;
    const minutesLeft = Math.floor(timeDiff / (1000 * 60));
    const hoursLeft = Math.floor(minutesLeft / 60);
    
    // Cho phép vào phòng chờ trước 30 phút
    if (minutesLeft <= 30) {
      return {
        status: 'starting_soon',
        timeLeft: minutesLeft > 60 ? `${hoursLeft} giờ ${minutesLeft % 60} phút nữa` : `${minutesLeft} phút nữa`,
        canStart: true // Cho phép vào phòng chờ
      };
    } else {
      return {
        status: 'upcoming',
        timeLeft: `${hoursLeft} giờ ${minutesLeft % 60} phút nữa`,
        canStart: false
      };
    }
  } else if (now >= startTime && now <= endTime) {
    const timeDiff = endTime - now;
    const minutesLeft = Math.floor(timeDiff / (1000 * 60));
    const hoursLeft = Math.floor(minutesLeft / 60);
    
    return {
      status: 'ongoing',
      timeLeft: minutesLeft > 60 ? `${hoursLeft} giờ ${minutesLeft % 60} phút` : `${minutesLeft} phút`,
      canStart: true
    };
  } else {
    return {
      status: 'completed',
      timeLeft: 'Đã kết thúc',
      canStart: false
    };
  }
};

export const getQuizStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const completed = mockQuizzes.filter(quiz => getQuizStatus(quiz).status === 'completed').length;
  const todayQuizzes = mockQuizzes.filter(quiz => {
    const quizDate = new Date(quiz.startTime);
    return quizDate >= today && quizDate < tomorrow;
  });
  const ongoing = mockQuizzes.filter(quiz => getQuizStatus(quiz).status === 'ongoing');
  const upcoming = mockQuizzes.filter(quiz => getQuizStatus(quiz).status === 'upcoming');
  
  return {
    completed,
    todayTotal: todayQuizzes.length,
    todayOngoing: todayQuizzes.filter(quiz => getQuizStatus(quiz).status === 'ongoing').length,
    ongoing: ongoing.length,
    upcoming: upcoming.length
  };
};

// Quiz results functions
export const getStudentQuizResults = (userId) => {
  return mockQuizResults.filter(result => result.userId === userId)
    .map(result => {
      const quiz = mockQuizzes.find(q => q.id === result.quizId);
      return {
        ...result,
        quiz
      };
    })
    .sort((a, b) => {
      // Ưu tiên chưa xem trước
      if (!a.viewedAt && b.viewedAt) return -1;
      if (a.viewedAt && !b.viewedAt) return 1;
      // Sau đó sắp xếp theo thời gian hoàn thành
      return new Date(b.completedAt) - new Date(a.completedAt);
    });
};

export const markResultAsViewed = (resultId) => {
  const result = mockQuizResults.find(r => r.id === resultId);
  if (result) {
    result.viewedAt = new Date();
  }
};

// Calendar functions
export const getQuizCalendar = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const quizDates = {};
  
  mockQuizzes.forEach(quiz => {
    const quizDate = new Date(quiz.startTime);
    if (quizDate >= startDate && quizDate <= endDate) {
      const dateKey = quizDate.getDate();
      if (!quizDates[dateKey]) {
        quizDates[dateKey] = [];
      }
      quizDates[dateKey].push({
        ...quiz,
        currentStatus: getQuizStatus(quiz)
      });
    }
  });
  
  return quizDates;
};

// Notification reminder functions
export const setQuizReminder = (quizId, reminderType, minutesBefore = null) => {
  if (!notificationReminders[quizId]) {
    notificationReminders[quizId] = {};
  }
  
  if (reminderType === 'interval') {
    notificationReminders[quizId].interval = true;
  } else if (reminderType === 'before' && minutesBefore) {
    notificationReminders[quizId].minutesBefore = minutesBefore;
  }
  
  localStorage.setItem('quizReminders', JSON.stringify(notificationReminders));
};

export const removeQuizReminder = (quizId) => {
  delete notificationReminders[quizId];
  localStorage.setItem('quizReminders', JSON.stringify(notificationReminders));
};

export const getQuizReminder = (quizId) => {
  return notificationReminders[quizId] || {};
};

// Authentication helper functions
export const authenticateUser = (username, password) => {
  const user = mockUsers.find(u => 
    (u.username === username || u.email === username) && u.password === password
  );
  
  if (user) {
    const token = btoa(JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      token
    };
  }
  
  return {
    success: false,
    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
  };
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      localStorage.removeItem('authToken');
      return null;
    }
    
    const user = mockUsers.find(u => u.id === decoded.id);
    return user ? {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    } : null;
  } catch {
    return null;
  }
};

