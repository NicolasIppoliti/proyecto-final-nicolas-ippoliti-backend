import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    // Fetch product details from backend
    axios.get(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/products/${id}`)
      .then(response => {
        console.log('Product details', response.data)
        setProduct(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the product details!', error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // Add product to cart
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const userId = JSON.parse(user).id;
      await axios.post(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/cart/${userId}/add/${product.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart', error.response.data);
    }
  };

  const handleBuyNow = () => {
    // Redirect to cart page
    window.location.href = '/cart';
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex">
        <img src={product.image} alt={product.name} className="w-1/3"/>
        <div className="ml-10 w-2/3">
          <h1 className="text-4xl mb-5">{product.name}</h1>
          <p className="mb-5">Description: {product.description}</p>
          <p className="mb-5">Code: {product.code}</p>
          <p className="mb-5">Category: {product.category}</p>
          <p className="mb-5">Price: ${product.price}</p>
          <p className="mb-5">Count In Stock: {product.countInStock}</p>
          <button className="bg-blue-500 text-white p-2 mr-2" onClick={handleAddToCart}>Add to cart</button>
          <button className="bg-green-500 text-white p-2" onClick={handleBuyNow}>Buy now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
