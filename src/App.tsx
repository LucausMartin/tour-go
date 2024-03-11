import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import { loginAction, logoutAction, readyLoginAction } from '@myStore/slices/loginSlice.ts';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const verifyLoginState = useCallback(async () => {
    try {
      const time = await localforage.getItem<number>('time');
      const loginTodo = await localforage.getItem<string>('loginTodo');
      // 如果时间戳不存在或者时间戳加七天小于当前时间戳，就将登录状态设置为 logout
      if (!time || time + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
        if (loginTodo && loginTodo === 'ready') {
          dispatch(readyLoginAction());
        } else {
          dispatch(logoutAction());
        }
      } else {
        dispatch(loginAction());
      }
      if (location.pathname === '/') {
        navigate('/home/discover/recommand');
      }
    } catch (error) {
      return null;
    }
  }, [dispatch, navigate, location.pathname]);

  useEffect(() => {
    verifyLoginState();
  }, [verifyLoginState]);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
