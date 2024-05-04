import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './home.css';
import { NavigateBar } from './components/Navigate/Navigate.tsx';
import { fetchData } from '@myCommon/fetchData.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { useDispatch } from 'react-redux';
import { addMessage } from '@myStore/slices/messageSlice.ts';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const getUnreadMessageFetch = async () => {
    try {
      const res = await fetchData<{
        message: {
          message_id: string;
          content: string;
          user: string;
          like: number;
        };
      }>('GET', {
        url: `/api/messages/get-unread-messages`
      });

      if (res.code === 200) {
        dispatch(addMessage(res.data));
      }
    } catch (e) {
      ErrorMessage('获取未读消息失败', 2000);
    }
  };
  useEffect(() => {
    getUnreadMessageFetch();
    const messageTimer = setInterval(() => {
      getUnreadMessageFetch();
    }, 5000);
    return () => {
      clearInterval(messageTimer);
    };
  });
  return (
    <div className="home-container">
      <NavigateBar />
      <main className="home-main">
        <Outlet></Outlet>
      </main>
    </div>
  );
};
