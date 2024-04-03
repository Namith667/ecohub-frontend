import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore();
      const orderDocs = await getDocs(collection(db, 'orders'));
      setOrders(orderDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, 'orders', id));
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div>
      <h2>Order Details</h2>
      <table className='userDataDiv'>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.orderDetails.name}</td>
              <td>{order.userID}</td>
              <td>{order.orderDetails.amount}</td>
              <td>{order.orderDetails.address}</td>
              <td><button onClick={() => handleDeleteOrder(order.id)}>Delete Order</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsPage;