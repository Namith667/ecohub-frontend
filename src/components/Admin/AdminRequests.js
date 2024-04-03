// src/components/Admin/AdminRequests.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch waste collection requests data
    const requestsRef = collection(firestore, 'wasteCollectionRequests');
    const requestsUnsubscribe = onSnapshot(requestsRef, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    });

    return () => {
      // Unsubscribe from snapshots to avoid memory leaks
      requestsUnsubscribe();
    };
  }, []);

  const handleApproveRequest = async (request) => {
    try {
      // Update the status of the request
      const requestDocRef = doc(firestore, 'wasteCollectionRequests', request.id);
      await updateDoc(requestDocRef, { status: 'Approved', wasteType: request.wasteType, location: request.location });
  
      // Increment the ECoin of the user
      const userDocRef = doc(firestore, 'users', request.userId);
      await updateDoc(userDocRef, { ECoin: increment(10) });
  
      console.log('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };
  const handleRejectRequest = async (request) => {
    try {
      // Update the status of the request to "Rejected"
      const requestDocRef = doc(db, 'wasteCollectionRequests', request.id);
      await updateDoc(requestDocRef, { status: 'Rejected' });
  
      //  actions when a request is rejected
    } catch (error) {
      console.error('Error during waste collection request rejection:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const requestDocRef = doc(firestore, 'wasteCollectionRequests', requestId);
      await deleteDoc(requestDocRef);
      console.log('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <div>
      <h2>Waste Collection Requests</h2>
      <table className='userDataDiv'>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>User ID</th>
            <th>Waste Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.userId}</td>
              <td>{request.wasteType}</td>
              <td>{request.location}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleApproveRequest(request)}>Approve</button>
                <button onClick={() => handleRejectRequest(request)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRequests;
