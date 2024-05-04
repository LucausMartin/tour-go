import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Error } from './pages/error/Error.tsx';
import { Me } from './pages/home/pages/me/Me.tsx';
import { Discover, DiscoverContent } from './pages/home/pages/discover/Discover.tsx';
import { Message } from './pages/home/pages/message/Message.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route caseSensitive path="home" element={<Home />}>
        <Route caseSensitive path="discover" element={<Discover />}>
          <Route caseSensitive path=":kind" element={<DiscoverContent />}></Route>
        </Route>
        <Route caseSensitive path="article/:id" lazy={() => import('./pages/home/pages/article/Article.tsx')}></Route>
        <Route
          caseSensitive
          path="search/article/:id"
          lazy={() => import('./pages/home/pages/searchArticle/Article.tsx')}
        ></Route>
        <Route caseSensitive path="search/:id" lazy={() => import('./pages/home/pages/search/Search.tsx')}></Route>
        <Route caseSensitive path="me" element={<Me></Me>}>
          <Route caseSensitive path=":kind" element={<></>} />
        </Route>
        <Route caseSensitive path="publish" lazy={() => import('./pages/home/pages/publish/Publish.tsx')} />
        <Route caseSensitive path="newPlan" lazy={() => import('./pages/home/pages/newPlan/NewPlan.tsx')} />
        <Route caseSensitive path="message" element={<Message></Message>}>
          <Route caseSensitive path=":kind" element={<></>}></Route>
        </Route>
      </Route>
    </Route>
  )
);
