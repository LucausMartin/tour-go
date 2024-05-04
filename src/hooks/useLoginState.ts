import { useEffect, useCallback } from 'react';
import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import { loginAction } from '@myStore/slices/loginSlice.ts';
import { useNavigate } from 'react-router-dom';
export const useLoginState = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verifyLoginState = useCallback(async () => {
    try {
      const time = await localforage.getItem<number>('time');
      if (location.pathname === '/') {
        navigate('/home/discover/recommand');
      }
      // 如果时间戳不存在或者时间戳加七天小于当前时间戳，就将登录状态设置为 logout
      if (!time || time + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
        // 正则匹配 /home/article/任意字符串 路径
        if (/^\/home\/article\/.*/.test(location.pathname)) {
          navigate(location.pathname);
        } else {
          navigate('/home/discover/recommand');
        }
      } else {
        dispatch(loginAction());
      }
    } catch (error) {
      return null;
    }
  }, [dispatch, navigate]);
  useEffect(() => {
    verifyLoginState();
  }, [verifyLoginState]);
};
