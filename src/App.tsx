import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home/discover');
  }, [navigate]);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
