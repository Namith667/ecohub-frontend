// ecohub-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { auth, firestore } from './firebase';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { doc, collection, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import './App.css';
import EcoHubLogo from './images/EcoHub.png';

import AdminHome from './components/HomeScreens/AdminHome';
import UserHome from './components/HomeScreens/UserHome';
import UserProfilePage from './components/HomeScreens/userProfilePage';

import WasteCollectionForm from './components/WasteCollection/WasteCollectionForm';
import ECommercePage from './components/ECommerce/ECommercePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminRequests from './components/Admin/AdminRequests';
import AdminUsers from './components/Admin/AdminUsers';
import OrderDetailsPage from './components/Admin/OrderDetailsPage';
import AddProduct from './components/Admin/AddProducts';
import Invoice from './components/Admin/Invoice'; 

import LoggedOutPage from './components/LoggedOutPage';
import CartPage from './components/ECommerce/CartPage';
import PaymentPage from './components/ECommerce/PaymentPage';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    setUser(user);
    if (user) {
      try {
        console.log('User authenticated:', user);

        // Fetch or create user document in Firestore
        const userDocRef = doc(collection(firestore, 'users'), user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // If the user document doesn't exist, create it
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'user', // Set default role to 'user', change it as needed
          });
          console.log('User document created:', userDocRef.path);
        }

        const userRole = userDocSnapshot.data().role;
        setIsAdmin(userRole === 'admin'); // Set the isAdmin state based on the user's role

        if (userRole === 'admin') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    } else {
      // If the user is not authenticated, clear the isAdmin state
      setIsAdmin(false);
    }
  });
 
  // Clean up the auth state observer on unmount
  return unsubscribe;
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

      navigate('/logged-out');

      console.log('User logged out');

      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
{}
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
        <header  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
          <div></div> {/* Empty div for balancing */}
          <img 
            src={EcoHubLogo} 
            alt="EcoHub Logo" 
            style={{ width: '70px', height: '70px', border: 'none', padding:'5px'}}
            onClick={() => {
              if (user.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/');
              }
            }}
          />
          <div></div> {/* Empty div for balancing */}
        </header>
          {user ? (
            <div className="header-right" >
              <p className="header-left"> {user.displayName} &nbsp; &nbsp;</p>
              <p className="header-left">  </p>

              <div className="dropdown" style={{ width: '30px', height: '30px', marginLeft: 'auto' }}>
                <img 
                  className="user-profile-icon"
                  src="https://cdn-icons-png.flaticon.com/512/3682/3682281.png" 
                  alt="User Profile" 
                  onClick={() => navigate('/userProfile')} 
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="dropdown-content">
                <p style={{fontSize: '13px'}} onClick={() => navigate('/userProfile')}>My Account</p>
                  <p style={{fontSize: '13px'}} onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={handleLogin} className="header-buttons">
              Login with Google
            </button>
            
        )}
        
      </div>
      </header>




      {/*}
      {user && (
          <div className="header-buttons">
            <button onClick={() => navigate('/wasteCollection')}>Go to Waste Collection</button>
            <button onClick={() => navigate('/eCommerce')}>Go to E-commerce</button>
            // Use the isAdmin status to conditionally render admin-related buttons 
            {isAdmin && (
              <>
                <button onClick={() => navigate('/admin')}>Go to Admin Dashboard</button>
                <button onClick={() => navigate('/admin/requests')}>Go to Admin Requests</button>
                <button onClick={() => navigate('/admin/users')}>Go to Admin Users</button>
                <button onClick={() => navigate('/admin/order-details')}>Go to Order Details</button>
                
                
              </>
            )}

          </div>
        )}
        */}
        
        











      
        <Routes>
          <Route path="/logged-out" element={<LoggedOutPage />} />
          <Route path="/wasteCollection" element={<WasteCollectionForm user={user} />} />
          <Route path="/eCommerce" element={<ECommercePage products={products} />} />
          <Route path="/cart" element={<CartPage cart={cart} />} /> {/* Add this route */}
          <Route path="/payment" element={<PaymentPage />} /> {/* Add this route */}
          <Route path="/userProfile" element={<UserProfilePage user={user} />} />
          <Route path="/invoice/:orderId" element={<Invoice />} />

          {isAdmin ? (
            <>
              <Route path="/" element={<AdminHome />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/order-details" element={<OrderDetailsPage />} />
              <Route path="/admin/add-product" element={<AddProduct />} /> {/* Add this route */}
              <Route path="/userProfile" element={<UserProfilePage user={user} />} />

        

            </>
          ) : (
            <Route path="/" element={<UserHome user={user} />} />
          )}
        </Routes>
    </div>
    
  );
}

export default App;