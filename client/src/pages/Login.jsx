import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', formData);
      if(response.status >= 200 && response.status < 300) {
        // Save the token and user data to the local storage or context
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
  
        // Redirect to home page
        window.location.href = '/';
      } else {
        console.error('Login failed.', response.data);
      }
    } catch (error) {
      console.error('Error logging in:', error.response.data);
    }
  };  

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl mb-10">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2">Email</label>
          <input 
            type="email" 
            className="border p-2 w-full"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2">Password</label>
          <input 
            type="password" 
            className="border p-2 w-full"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}

export default Login;
