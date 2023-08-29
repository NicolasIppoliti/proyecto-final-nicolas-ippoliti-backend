import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user);
  }, []);


  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl mb-10">Profile</h1>
      <h2 className="text-2xl mb-5">User Information</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
