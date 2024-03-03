// ecohub-frontend/src/components/ECommerce/ProductList.js
import React from 'react';

const ProductList = ({ products }) => {
  console.log(products);
  return (
    <div>
      <h2>Product List</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
            <p>Description: {product.Description}</p>
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
    alignItems: 'center', // Align items horizontally (centered)
    justifyContent: 'center', // Align items vertically (centered)
  };

export default ProductList;
