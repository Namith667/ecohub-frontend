import { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, doc, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; // replace './firebase' with the path to your Firebase config file
const db = getFirestore();

function AddProduct() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data().role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async () => {
    if (!isAdmin) {
        alert('Only admins can add products.');
        return;
      }
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        Description: description,
        Image: image,
        Name: name,
        Price: price,
      });

      console.log('Document written with ID: ', docRef.id);

      // Clear the input fields
      setDescription('');
      setImage('');
      setName('');
      setPrice('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AddProduct;