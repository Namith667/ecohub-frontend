// ecohub-frontend/src/components/ECommerce/ECommercePage.js
import { collection, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

function ECommercePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCart(docSnap.data().cart || []);
        }
      }
    };

    fetchCart();
  }, [db, user]);

  const addToCart = async (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
    }
  };

  const navigate = useNavigate();
  const goToCart = () => {
    navigate('/cart', { state: { cart } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(getFirestore(), 'products');
        onSnapshot(productsCollection, (snapshot) => {
          const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProducts(productsData);
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>E-Commerce Page</h2>
      <div onClick={goToCart}>
          <FontAwesomeIcon icon={faShoppingCart} />
          <span>({cart.length})</span>
        </div>
    </div>
    <ProductList products={products} addToCart={addToCart} />
    {/* Other components */}
    </div>
  );
}

export default ECommercePage;
