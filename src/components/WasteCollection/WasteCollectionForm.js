// ecohub-frontend/src/components/WasteCollection/WasteCollectionForm.js
import React, { useState } from 'react';
//import { firestore } from '../../firebase';
//import firebase from 'firebase/compat/app';
import { getFirestore, collection, addDoc, serverTimestamp, FieldValue ,doc,setDoc,getDoc } from 'firebase/firestore';
//import { auth } from '../../firebase'; 
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

function WasteCollectionForm({ user }) {
  const [wasteType, setWasteType] = useState('');
const [location, setLocation] = useState('');

const handleWasteCollection = async () => {
  try {
    const wasteCollectionRef = collection(db, 'wasteCollectionRequests');
    const newDocRef = doc(wasteCollectionRef); // Create a new document reference with a unique ID

    
    await setDoc(newDocRef, {
      reqID: newDocRef.id, // Use the unique ID as the request ID
      userId: user.uid,
      wasteType,
      location,
      status: 'Pending',
      timestamp: serverTimestamp(), 
    });

    alert('Waste collection request sent!');
    setWasteType('');
    setLocation('');
  } catch (error) {
    console.error('Error during waste collection request:', error);
  }
};

return (
  <div>
    <h2>Waste Collection Form</h2>
    <label>
      Waste Type:
      <input
        type="text"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
      />
    </label>
    <label>
      Location:
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </label>
    <button onClick={handleWasteCollection}>Submit Waste Collection Request</button>
  </div>
);
}

export default WasteCollectionForm;
