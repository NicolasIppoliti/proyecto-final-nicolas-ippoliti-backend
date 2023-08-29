import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await axios.get(`https://proyecto-final-nicolas-ippoliti-backend.onrender.com/api/orders/${user.id}}`);
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {orders.map(order => (
        <div key={order.id} className="border p-5 mb-5">
          <h2 className="text-xl mb-2">Order #{order.id}</h2>
          <ul>
            {order.orderItems.map(item => (
              <>
                <li key={item.id}>{item.product}</li>
                <li key={item.id}>{item.quantity}</li>
              </>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
