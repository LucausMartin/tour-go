import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Error } from './pages/error/Error.tsx';
import { Discover } from './pages/home/pages/discover/Discover.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route path="home" element={<Home />}>
        <Route caseSensitive path="discover" element={<Discover />}></Route>
        <Route caseSensitive path="me" lazy={() => import('./pages/home/pages/me/Me.tsx')} />
        <Route caseSensitive path="publish" lazy={() => import('./pages/home/pages/publish/Publish.tsx')} />
        <Route caseSensitive path="message" lazy={() => import('./pages/home/pages/message/Message.tsx')} />
      </Route>
      <Route caseSensitive path="login" lazy={() => import('./pages/login/Login.tsx')} />
      <Route caseSensitive path="register" lazy={() => import('./pages/register/Register.tsx')} />
    </Route>
  )
);
