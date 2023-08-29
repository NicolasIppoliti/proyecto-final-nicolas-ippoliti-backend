import { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };  

  const handleCheckout = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user).id;
    axios.post(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/orders`, {
      user: userId,
      orderItems: cartItems.map(cartItem => ({
        product: cartItem.product.id,
        quantity: cartItem.quantity,
      })),
      totalPrice: cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data && response.data._id) {
          // Save order to state and clear cart
          setOrder(response.data);
          localStorage.removeItem('cartItems');
          setCartItems([]);
          // Open modal
          openModal();
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error checking out!', error);
      });
  }

  useEffect(() => {
    // Fetch cart items from backend
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user).id;
    axios.get(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/cart/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async response => {
        if (response.data && response.data.cartItems) {
          // Fetch product details for each cart item
          const cartItemsWithDetails = await Promise.all(response.data.cartItems.map(async cartItem => {
            const productResponse = await axios.get(`https://proyecto-final-nicolas-ippoliti-backend.vercel.app/api/products/${cartItem.product}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            return {
              ...cartItem,
              product: productResponse.data,
            };
          }));
          setCartItems(cartItemsWithDetails);
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the cart items!', error);
      });
  
  }, []);

  return (
    <div className="container mx-auto mt-10 p-10">
      <h1 className="text-4xl mb-10">Cart</h1>
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
          {cartItems.map(cartItem => (
            <div key={cartItem._id} className="flex items-center border p-5 mb-5">
              <img src={cartItem.product.image} alt={cartItem.product.name} className="w-20 h-20 mr-5" />
              <div className="flex-grow">
                <h2 className="text-xl mb-2">{cartItem.product.name}</h2>
                <p className="text-gray-600 mb-2">Category: {cartItem.product.category}</p>
                <p className="text-gray-600 mb-2">Price: ${cartItem.product.price}</p>
              </div>
              <div className="flex flex-col items-center ml-5">
                <p className="text-gray-600 mb-2">Quantity</p>
                <input type="number" value={cartItem.quantity} className="border p-2 text-center w-16" readOnly />
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-1 border p-5">
          <h2 className="text-xl mb-5">Summary</h2>
          <p className="text-gray-600 mb-2">Total Quantity: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
          <p className="text-xl mb-5">Total Price: ${cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0)}</p>
          <button className="bg-blue-500 text-white p-5 w-full text-xl" onClick={() => handleCheckout()}>
            Checkout
          </button>
        </div>
      </div>
  
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded">
            <h2 className="text-xl mb-5">Order Summary</h2>
            <p className="text-gray-600 mb-2">Total Quantity: {order.orderItems.length}</p>
            <p className="text-xl mb-5">Total Price: ${order.totalPrice}</p>
            <p className="text-xl mb-5">Your order has been placed!</p>
            <p className="text-xl mb-5">Thank you for shopping with us!</p>
            <p className="text-xl mb-5">You will receive an email confirmation shortly.</p>
            <p className="text-xl mb-5">Order ID: {order._id}</p>

            <button className="bg-blue-500 text-white p-5 w-full text-xl" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );  
}

export default Cart;
