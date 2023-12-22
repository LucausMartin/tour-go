import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<div>404</div>}>
      <Route index element={<div>Home</div>}></Route>
    </Route>
  )
);
