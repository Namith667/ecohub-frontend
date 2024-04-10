import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import '../../App.css';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wasteCollectionRequests, setWasteCollectionRequests] = useState([]); 
  const [eCoinBalance, setECoinBalance] = useState(0);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  
const navigate = useNavigate();
const handleViewInvoice = (orderId) => {
  navigate(`/invoice/${orderId}`);
};

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const db = getFirestore();

        // Fetch the user's orders
        const ordersQuery = query(collection(db, 'orders'), where('userID', '==', user.uid));
        const ordersSnapshot = await getDocs(ordersQuery);
        setOrders(ordersSnapshot.docs.map(doc => doc.data()));

        // Fetch the user's current cart data
        const cartQuery = query(collection(db, 'carts'), where('userID', '==', user.uid));
        const cartSnapshot = await getDocs(cartQuery);
        setCart(cartSnapshot.docs.map(doc => doc.data()));

        // Fetch the user's waste collection requests
        const wasteCollectionRequestsQuery = query(collection(db, 'wasteCollectionRequests'), where('userId', '==', user.uid));
        const wasteCollectionRequestsSnapshot = await getDocs(wasteCollectionRequestsQuery);
        setWasteCollectionRequests(wasteCollectionRequestsSnapshot.docs.map(doc => doc.data())); 

        // Fetch the user's Ecoin balance
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setECoinBalance(userDoc.data().ECoin);
      };

      fetchUserData();
    }
  }, [user]);

  return (
    <div>
      <div style={{ textAlign: 'left', width:'100%'}}>
        <h2>User Profile</h2>
        <button 
            className="eCoinBalanceButton" 
            style={{ 
                float: 'right', 
                color: 'white', 
                backgroundColor: '#009879', 
                padding: '10px', 
                fontSize: '18px',
                border: 'none',
                borderRadius: '5px'
            }}
            >
            ECoin Balance: {eCoinBalance}
        </button>

        <table style={{textAlign:'left'}}>
          <tr>
            <td>Username:</td>
            <td>{user.displayName}</td>
          </tr>
          <tr>
            <td>Email ID:</td>
            <td>{user.email}</td>
          </tr>
        </table>
      </div>
     
      <div className="userDataDiv">
      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Address</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.orderID}</td>
              <td>{order.orderDetails.amount}</td>
              <td>{order.orderDetails.address}</td>
              <td>{order.orderDetails.products ? order.orderDetails.products.map(product => product.Name).join(', ') : 'No items'}</td>
              <td>
                <button onClick={() => handleViewInvoice(order.orderID)}>View Invoice</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>



<div className="userDataDiv">
  <h3>Waste Collection Requests</h3>
  <table>
    <colgroup>
      <col style={{width: '10%'}}/>
      <col style={{width: '10%'}}/>
      <col style={{width: '10%'}}/>
      <col style={{width: '10%'}}/>
      <col style={{width: '10%'}}/>
    </colgroup>
    <thead>
      <tr>
        <th>Request ID</th>
        <th>Status</th>
        <th>Timestamp</th>
        <th>Waste Type</th>
        <th>Location</th>
      </tr>
    </thead>
    {wasteCollectionRequests.map((request, index) => (
      <tbody key={index}>
        <tr>
          <td>{request.reqID}</td>
          <td>{request.status}</td>
          <td>{request.timestamp.toDate().toLocaleString()}</td>
          <td>{request.wasteType}</td>
          <td>{request.location}</td>
        </tr>
      </tbody>
    ))}
  </table>
</div>
            
      <h3>Current Cart Data</h3>
      {cart.map((item, index) => (
        <div key={index}>
          <h4>Item {index + 1}</h4>
          <p>Product: {item.product}</p>
          <p>Quantity: {item.quantity}</p>
          
        </div>
      ))}
    </div>
  );
};

export default UserProfilePage;

