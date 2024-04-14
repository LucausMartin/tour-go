import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Error } from './pages/error/Error.tsx';
import { Discover, DiscoverContent } from './pages/home/pages/discover/Discover.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route caseSensitive path="home" element={<Home />}>
        <Route caseSensitive path="discover" element={<Discover />}>
          <Route caseSensitive path=":kind" element={<DiscoverContent />}></Route>
        </Route>
        <Route caseSensitive path="me" lazy={() => import('./pages/home/pages/me/Me.tsx')}>
          <Route caseSensitive path=":kind" element={<></>} />
        </Route>
        <Route caseSensitive path="publish" lazy={() => import('./pages/home/pages/publish/Publish.tsx')} />
        <Route caseSensitive path="newPlan" lazy={() => import('./pages/home/pages/newPlan/NewPlan.tsx')} />
        <Route caseSensitive path="message" lazy={() => import('./pages/home/pages/message/Message.tsx')}>
          <Route caseSensitive path=":kind" element={<></>}></Route>
        </Route>
      </Route>
    </Route>
  )
);
