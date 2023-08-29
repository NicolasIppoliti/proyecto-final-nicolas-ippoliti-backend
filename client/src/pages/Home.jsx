import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch products from backend
    axios.get('https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const user = localStorage.getItem('user');
        const userId = JSON.parse(user).id;
        const response = await axios.post(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/cart/${userId}/add/${productId}`, { productId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
        console.log('Add to Cart Response:', response.data);
        // Console log status code
        console.log('Status code:', response.status);
    } catch (error) {
        if (error.response) {
            console.error('Error adding item to cart', error.response.data);
        } else {
            console.error('Error adding item to cart', error.message);
        }
    }
  };

  const handlePurchase = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const user = localStorage.getItem('user');
      const userId = JSON.parse(user).id;
      const response = await axios.post(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/cart/${userId}/add/${productId}`, {}, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      console.log('Add to Cart Response:', response.data);
      // Redirect to cart
      window.location.href = '/cart';
  } catch (error) {
      if (error.response) {
          console.error('Error adding item to cart', error.response.data);
      } else {
          console.error('Error adding item to cart', error.message);
      }
  }
};

  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl mb-10">Home</h1>
      <div className="flex mb-10">
        <input 
          type="text" 
          className="border p-2 flex-1 mr-2"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map(product => (
          <div key={product.id} className="border p-5">
            <h2 className="text-xl mb-2">{product.name}</h2>
            <p className="mb-2">Category: {product.category}</p>
            <p className="mb-2">Price: ${product.price}</p>
            <button className="bg-blue-500 text-white p-2 mr-2" onClick={() => handleAddToCart(product.id)}>Add to cart</button>
            <button className="bg-green-500 text-white p-2" onClick={() => handlePurchase(product.id)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
