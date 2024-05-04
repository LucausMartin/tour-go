import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginPopUps } from './pages/login/Login.tsx';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';

function App() {
  const navigate = useNavigate();
  const loginState = useSelector(selectLogin);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/discover/recommand');
    }
  }, [navigate]);

  return (
    <>
      <Outlet></Outlet>
      {loginState === 'ready' ? <LoginPopUps /> : <></>}
    </>
  );
}

export default App;
