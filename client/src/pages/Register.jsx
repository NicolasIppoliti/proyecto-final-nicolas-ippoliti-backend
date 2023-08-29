import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
  
      console.log('Response from server', response.data);
  
      if(response.status >= 200 && response.status < 300) {
        await axios.get('http://localhost:3000/api/users/auth/success', {
          headers: {  
            // Send the JWT in the Authorization header
            Authorization: `Bearer ${response.data.token}`,
          },
        });
  
        // Redirect to home page
        window.location.href = '/login';
      } else {
        await axios.get('http://localhost:3000/api/users/auth/failure', {
          headers: {
            // Send the JWT in the Authorization header
            Authorization: `Bearer ${response.data.token}`,
          },
        });
  
        // Redirect to login page
        window.location.href = '/register';
      }
    } catch (error) {
      console.error('Error making request', error.response.data);
    }
  };  

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl mb-10">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2">Name</label>
          <input 
            type="text" 
            className="border p-2 w-full"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
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
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
    </div>
  );
}

export default Register;
