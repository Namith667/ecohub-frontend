// components/LoggedOutPage.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
function LoggedOutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, redirect to the home page
        navigate('/');
      }
    });
    // Clean up the auth state observer on unmount
    return unsubscribe;
  }, [navigate]);

  return (
    <div>
      <h1>Logged Out Successfully</h1>
      <p>You have been logged out. Thank you for using our app!</p>
    </div>
  );
}

export default LoggedOutPage;