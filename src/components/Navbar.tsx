import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { User } from '../types';
import { Button } from 'antd';

interface INavbar {
    user: any;
    setUser: (value: any) => void;
}

export const Navbar = () => {
const [user, setUser] = useState<User | null>(null);

  const updateUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ _id: payload.id, email: payload.email, role: payload.role, token });
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser(); // Initial check on mount

    const handleStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('storageChange')); // Trigger update
  };

return (
    <nav className="bg-indigo-600 text-white shadow-md">
          <div className="container py-4 flex justify-between items-center navbar">
            <Link to="/" className="text-2xl font-bold link">
              CodeCast
            </Link>
            <div className='actions-buttons'>
              {user ? (
                <>
                  {user.role === 'creator' && (
                    <Link to="/creator" className="hover:text-indigo-200 transition  link">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="hover:text-indigo-200 transition link">
                      Admin
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    className="hover:text-indigo-200 transition"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-indigo-200 transition link">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-indigo-200 transition link">
                    Register
                  </Link>
                </>
              )}
              </div>
          </div>
        </nav>
)
}