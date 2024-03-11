import { selectLogin } from '@myStore/slices/loginSlice.ts';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import localforage from 'localforage';

const useLoginForbidden = () => {
  const loginState = useSelector(selectLogin);
  const navigate = useNavigate();

  const flagLoginState = async () => {
    try {
      await localforage.setItem('loginTodo', 'ready');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loginState !== 'login') {
      navigate('/');
      flagLoginState();
    }
  });
};

export { useLoginForbidden };
