import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import QuizPage from '../pages/QuizPage';
import AdminLayout from '../layouts/AdminLayout';
import ScoreResults from '../components/ScoreResults';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'quiz/:id',
        element: <QuizPage />,
      },
      {
        path: 'scores',
        element: <ScoreResults />,
      }
    ],
  },
]);