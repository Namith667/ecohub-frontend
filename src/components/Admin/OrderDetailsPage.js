import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';

Chart.register(BarElement, CategoryScale, LinearScale);

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [productFrequency, setProductFrequency] = useState({});
  const navigate = useNavigate();

  const handleViewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore();
      const orderDocs = await getDocs(collection(db, 'orders'));
      const ordersData = orderDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);

      // Calculate the frequency of each product
      const frequency = {};
      for (const order of ordersData) {
        if (Array.isArray(order.orderDetails.products)) {
          for (const product of order.orderDetails.products) {
            if (product.Name && frequency[product.Name]) {
              frequency[product.Name]++;
            } else if (product.Name) {
              frequency[product.Name] = 1;
            }
          }
        }
      }
    
      setProductFrequency(frequency);
    };
    
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, 'orders', id));
    setOrders(orders.filter(order => order.id !== id));
  };

  const maxFrequency = Math.max(...Object.values(productFrequency));


  return (
    <div>
    <h2>Order Details</h2>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}> {/* Add this line */}
      <Bar
        key={Math.random()}
        data={{
          labels: Object.keys(productFrequency),
          datasets: [{
            label: 'Most Bought Products',
            data: Object.values(productFrequency),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: maxFrequency + 1
            },
            x: {
              type: 'category',
            }
          }
        }}
      />
    </div> 

      <table className='userDataDiv'>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Order ID</th>
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
              <td>{order.orderID}</td>
              <td>{order.orderDetails.amount}</td>
              <td>{order.orderDetails.address}</td>
              <td>
                <button onClick={() => handleViewInvoice(order.id)}>View Invoice</button>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete Order</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsPage;