import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Invoice = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const db = getFirestore();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        console.log(orderDoc); // Log the orderDoc to the console
        console.log(orderDoc.data()); // Log the order data to the console
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          console.log('No such order!');
        }
      } catch (error) {
        console.log('Error fetching order:', error);
      }
    };
  
    fetchOrder();
  }, [db, orderId]);

  if (!order) {
    return <p>Loading...</p>;
  }
  const tableCellStyles = {
    padding: '10px'
  };
  
  
return (
    <div >
        
        <h1>EcoHub.in</h1>
        <h3>Invoice</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
         <table className="userDataDiv" style={{ width: '50%' }}>  
            <tbody>
                <tr>
                    <td>Order ID:</td>
                    <td>{order.id}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{order.orderDetails.name}</td>
                </tr>
                <tr>
                    <td>User ID:</td>
                    <td>{order.userID}</td>
                </tr>
                <tr>
                    <td>Amount:</td>
                    <td>{order.orderDetails.amount}</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td>{order.orderDetails.address}</td>
                </tr>
            </tbody>
        </table>
        </div>

        <h3>Products:</h3>
         <div style={{ display: 'flex', justifyContent: 'center' }}>
          <table className="userDataDiv" style={{ width: '50%' }}>  
            <tbody>
                {order.orderDetails.products.map((product, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td>Product Name:</td>
                            <td>{product.Name}</td>
                        </tr>
                        <tr>
                            <td>Product Price:</td>
                            <td>{product.Price}</td>
                        </tr>
                        {/* Add more product details if needed */}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
    <div style={ { padding: '150px'}}>
    <button onClick={() => window.print()}>Print Invoice</button>
    </div>
    </div>
    
);
};

export default Invoice;