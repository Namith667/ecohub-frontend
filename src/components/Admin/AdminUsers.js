// src/components/Admin/AdminUsers.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data
    const usersRef = collection(firestore, 'users');
    const usersUnsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => {
      // Unsubscribe from snapshots to avoid memory leaks
      usersUnsubscribe();
    };
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const userDocRef = firestore.doc(`users/${userId}`);
      await deleteDoc(userDocRef);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <table className='userDataDiv'>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Display Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.uid}</td>
              <td>{user.email}</td>
              <td>{user.displayName}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
