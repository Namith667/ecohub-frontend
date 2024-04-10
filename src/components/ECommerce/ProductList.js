// ecohub-frontend/src/components/ECommerce/ProductList.js
import React from 'react';

const ProductList = ({ products, addToCart }) => { // Destructure addToCart from props
  console.log(products);
  return (
    <div>
      <h2>Product List</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',}}>
        {products.map((product) => (
          <div key={product.id} style={productBoxStyle}>
            {product.Image && (
              <img
                src={product.Image}
                alt={product.Name}
                style={{ maxWidth: '100%', maxHeight: '150px', margin: '10px 0' }}
              />
            )}
            <h3>{product.Name}</h3>
            <p>Price: ${product.Price}</p>
            <p> {product.Description}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button> {/* Call addToCart function */}
          </div>
        ))}
      </div>
    </div>
  );
};

const productBoxStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
    
  };

export default ProductList;
