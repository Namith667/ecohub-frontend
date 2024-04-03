// CartPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc,updateDoc } from 'firebase/firestore';
import PaymentPage from './PaymentPage';
import { useNavigate } from 'react-router-dom';



const CartPage = () => {
    const [cart, setCart] = useState([]);
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    const navigate = useNavigate();
    //const history = useHistory();
  
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
  
    const calculateTotalPrice = () => {
      return cart.reduce((total, item) => total + (item.Price || 0), 0).toFixed(2);
    };
  
    const handleRemoveItem = async (index) => {
      // Remove the item from the cart
      const newCart = [...cart];
      newCart.splice(index, 1);
  
      // Update the cart data in Firestore
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { cart: newCart });
      }
  
      // Update the cart state
      setCart(newCart);
    };
  
    const handleCheckout = () => {
        const totalPrice = calculateTotalPrice();
        navigate('/payment', { state: { cart, totalPrice } });
      };
  
    return (
      <div>
        <h2>Cart</h2>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          {cart.map((item, index) => (
            <div key={index} style={productBoxStyle}>
              <div style={productImageStyle}>
                {item.Image && (
                  <img
                    src={item.Image}
                    alt={item.Name}
                    style={{ maxWidth: '100%', maxHeight: '150px' }}
                  />
                )}
              </div>
              <div style={productDetailsStyle}>
                <h3>{item.Name}</h3>
                <p>Price: ${item.Price}</p>
                <button onClick={() => handleRemoveItem(index)}>Remove from cart</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          {/* Display total price */}
          <h3>Total price: ${calculateTotalPrice()}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
        
      </div>
    );
  };
  

const productBoxStyle = {
  display: 'flex',
  border: '1px solid #ddd',
  padding: '10px',
  margin: '10px',
  width: '100%',
};

const productImageStyle = {
  flex: '1',
  marginRight: '10px',
};

const productDetailsStyle = {
  flex: '1',
};

export default CartPage;