import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // Redirect to home page
  window.location.href = '/';
};

function Navbar() {
  const user = localStorage.getItem('user');

  return (
    <nav className="p-4 bg-blue-600 text-white">
      <Link to="/" className="text-2xl">
        E-commerce
      </Link>
      <div className="float-right">
        <Link to="/" className="px-2">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="px-2">
              Profile
            </Link>
            <Link to="/" onClick={handleLogout} className="px-2">
              Logout
            </Link>

          </>
        ) : (
          <>
            <Link to="/register" className="px-2">
              Register
            </Link>
            <Link to="/login" className="px-2">
              Login
            </Link>
          </>
        )}
        <Link to="/cart" className="px-2">
          Cart
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
