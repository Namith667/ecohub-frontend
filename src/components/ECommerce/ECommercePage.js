// ecohub-frontend/src/components/ECommerce/ECommercePage.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import ProductList from './ProductList'; // Import the updated ProductList component

function ECommercePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(getFirestore(), 'products');
        const productsSnapshot = await onSnapshot(productsCollection, (snapshot) => {
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
      <h2>E-Commerce Page</h2>
      <ProductList products={products} />
    </div>
  );
}

export default ECommercePage;
