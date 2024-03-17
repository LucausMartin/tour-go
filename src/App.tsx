import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/discover/recommand');
    }
  }, [navigate]);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
