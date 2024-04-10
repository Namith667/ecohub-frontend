import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
// import { Link } from 'react-router-dom';

const checkAdminStatus = async (currentUserUid) => {
  try {
    console.log('Checking admin status for user:', currentUserUid);
    const usersRef = collection(firestore, 'users');
    const userDoc = await getDoc(doc(usersRef, currentUserUid));

    console.log('User document:', userDoc.data());

    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = auth.currentUser;
        const currentUserUid = currentUser ? currentUser.uid : null;

        if (!currentUserUid) {
          console.error('User not authenticated');
          navigate('/'); // Redirect to the home page or login page
          return;
        }

        // Check admin status
        const isAdminUser = await checkAdminStatus(currentUserUid);
        setIsAdmin(isAdminUser);

        if (!isAdminUser) {
          // Redirect or handle unauthorized access
          console.log('Unauthorized access to admin dashboard');
          // Optionally, redirect the user to another page
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {isAdmin && (
        <>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/wasteCollection')}>Waste Collection</button>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/eCommerce')}>ECommerce</button>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/admin/requests')}>Waste Collection Requests</button>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/admin/users')}>Users Details</button>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/admin/order-details')}>All Orders</button>
          <button style={{ padding: '10px 20px', fontSize: '16px', width: '300px', height: '150px' }} onClick={() => navigate('/admin/add-product')}>Add Product</button>

        </>
      )}

    </div>
  );
};

export default AdminDashboard;
