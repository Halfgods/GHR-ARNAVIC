import React, { useEffect } from 'react'
import ARScene from './Components/ARScene/ARScene';
import { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imgUrl = location.state;

  useEffect(() => {
    if (!location.state) {
      navigate('/qr');
    }
  }, []);

  if (!imgUrl) return null;

  return (
    <>
      <Toaster />
      <ARScene imgUrl={imgUrl} />
    </>
  )
}

export default App