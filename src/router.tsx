import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Error } from './pages/error/Error.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route caseSensitive path="login" lazy={() => import('./pages/login/Login.tsx')} />
      <Route caseSensitive path="register" lazy={() => import('./pages/register/Register.tsx')} />
    </Route>
  )
);
