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
      <nav>
        <ul>
          <li><Link to="/admin/requests">Waste Collection Requests</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <Link to="/admin/order-details">Order Details</Link>
        </ul>
      </nav>
      
    </div>
  );
};

export default AdminDashboard;
