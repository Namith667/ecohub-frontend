import { React, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection ,setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { increment } from 'firebase/firestore';

const PaymentPage = () => {
    // Get the cart data from the location state
    const location = useLocation();
  const initialCart = location.state.cart;
  const [cart, setCart] = useState(initialCart);
  
  const [address, setAddress] = useState('');
  const [isOrderConfirmed, setOrderConfirmed] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const initialTotalPrice = location.state.totalPrice;
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
  const [eCoinBalance, setECoinBalance] = useState(0);
  const [useECoin, setUseECoin] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchECoinBalance = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setECoinBalance(userDoc.data().ECoin);
      };

      fetchECoinBalance();

      let amount = initialTotalPrice;
      if (useECoin && eCoinBalance >= 10) {
        amount *= 0.9; // Apply a 10% discount
      }
      setTotalPrice(amount);
    }
  }, [cart, initialTotalPrice, useECoin, eCoinBalance, db, user]);

  const handleConfirmOrder = async (event) => {
    event.preventDefault();

    let amount = totalPrice; // Use the totalPrice state variable
    let eCoinsUsed = 0;

    if (useECoin && eCoinBalance >= 10) {
      amount *= 0.9; // Apply a 10% discount
      eCoinsUsed = 10; // Set the number of ECoins used
    }
    

    let orderDocRef;
    if (user) {
      console.log(cart);
      const order = {
        orderID: doc(collection(db, 'orders')).id, // Add this line
        userID: user.uid,
        orderDetails: {
          name: user.displayName,
          products: cart,
          amount: amount, // This is the final total price
          address: address,
        },
      };
  
      orderDocRef = doc(db, 'orders', order.orderID); 
    await setDoc(orderDocRef, order); 
    setCart([]);
  }

    if (eCoinsUsed > 0) {
      // Reduce the number of ECoins used from the user's balance
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { ECoin: increment(-eCoinsUsed) });
    }

    // Update the final total price in the order document
    await updateDoc(orderDocRef, { 'orderDetails.amount': amount });

    setOrderConfirmed(true);
  };

  if (isOrderConfirmed) {
    return <h2>Order confirmed! Thank you for your purchase.</h2>;
  }

  return (
    <div>
      <h2>Order Confirmation</h2>
      <form onSubmit={handleConfirmOrder}>
        <label>
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <div>
          <p>ECoin Balance: {eCoinBalance}</p>
          <label>
            Use my Ecoin Balance
            <input type="checkbox" checked={useECoin} onChange={(e) => setUseECoin(e.target.checked)} />
          </label>
          <p>Total Price: {totalPrice}</p> {/* Display the total price */}
        </div>
        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
};

export default PaymentPage;