// ecohub-frontend/src/components/WasteCollection/WasteCollectionForm.js
import React, { useState } from 'react';
import { firestore } from '../../firebase';
import firebase from 'firebase/compat/app';
import { getFirestore, collection, addDoc, serverTimestamp, FieldValue  } from 'firebase/firestore';
import { auth } from '../../firebase'; // Make sure to import auth from your firebase file


function WasteCollectionForm({ user }) {
  const [wasteDetails, setWasteDetails] = useState('');

//console.log('Submitting waste collection request...');
//timestamp: firebase.firestore.FieldValue.serverTimestamp(),

const handleWasteCollection = async () => {
    try {
      if (!user) {
        console.error('User not logged in.');
        return;
      }
  
      // Get the Firestore instance
      const db = getFirestore();
  
      // Use the "collection" function to reference the "wasteCollectionRequests" collection
      const wasteCollectionRef = collection(db, 'wasteCollectionRequests');
  
      // Use "addDoc" to add a document to the collection
      await addDoc(wasteCollectionRef, {
        userId: user.uid,
        wasteDetails,
        timestamp: serverTimestamp(), 
      });
  
      alert('Waste collection request sent!');
      setWasteDetails('');
    } catch (error) {
      console.error('Error during waste collection request:', error);
    }
  };
  return (
    <div>
      <h2>Waste Collection Form</h2>
      <label>
        Waste Details:
        <input
          type="text"
          value={wasteDetails}
          onChange={(e) => setWasteDetails(e.target.value)}
        />
      </label>
      <button onClick={handleWasteCollection}>Submit Waste Collection Request</button>
    </div>
  );
}

export default WasteCollectionForm;
