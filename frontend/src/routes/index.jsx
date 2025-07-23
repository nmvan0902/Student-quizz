import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
// import DashboardPage from '../pages/DashboardPage';
import QuizPage from '../pages/QuizPage';
// import ResultPage from '../pages/ResultPage';
import AdminLayout from '../layouts/AdminLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
    //   {
    //     path: '/dashboard',
    //     element: <DashboardPage />,
    //   },
      {
        path: '/quiz/:id',
        element: <QuizPage />,
      },
    //   {
    //     path: '/results',
    //     element: <ResultPage />,
    //   },
    ],
  },
]);