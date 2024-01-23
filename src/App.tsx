import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/discover/recommand');
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
