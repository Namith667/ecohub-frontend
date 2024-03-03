
// ecohub-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './App.css';


import WasteCollectionForm from './components/WasteCollection/WasteCollectionForm';
import ProductList from './components/ECommerce/ProductList';
import ECommercePage from './components/ECommerce/ECommercePage';

function App() {
  const [user, setUser] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Fetch user's waste collection requests
        const userRequestsRef = collection(firestore, 'wasteCollectionRequests');
        const userRequestsUnsubscribe = onSnapshot(userRequestsRef, (snapshot) => {
          const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserRequests(requests);
        });
  
        // Fetch product data for the E-commerce page
        const productsRef = collection(firestore, 'products');
        const productsUnsubscribe = onSnapshot(productsRef, (snapshot) => {
          const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProducts(productsData);
        });
  
        return () => {
          // Unsubscribe from snapshots to avoid memory leaks
          userRequestsUnsubscribe();
          productsUnsubscribe();
        };
      }
    });
  

    return () => {
      // Unsubscribe from authentication state changes
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="header-left">EcoHub</h1>
          {user ? (
            <div className="header-right">
              <p className="header-left">Welcome, {user.displayName}!</p>
              <button onClick={handleLogout} className="header-buttons">Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="header-buttons">Login with Google</button>
          )}
        </div>
        {user && (
          <div className="header-buttons">
            <button onClick={() => navigate('/wasteCollection')}>Go to Waste Collection</button>
            <button onClick={() => navigate('/eCommerce')}>Go to E-commerce</button>
          </div>
        )}
        <Routes>
          <Route path="/wasteCollection" element={<WasteCollectionForm user={user} />} />
          <Route path="/eCommerce" element={<ECommercePage products={products} />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;