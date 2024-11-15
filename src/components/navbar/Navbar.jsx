import React, { Fragment, useContext, useState, useEffect } from 'react';
import myContext from '../../context/data/myContext';
import { BsFillCloudSunFill } from 'react-icons/bs';
import { FiSun } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { FaShoppingBag } from 'react-icons/fa';  // Shopping Bag Icon
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { AiOutlineHeart } from 'react-icons/ai';

function Navbar() {
  const context = useContext(myContext);
  const { mode, toggleMode } = context;

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Modal state for profile
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear('user');
    window.location.href = '/login';
  };

  const cartItems = useSelector((state) => state.cart);

  const closeProfileModal = () => {
    setProfileOpen(false); // Close profile modal
  };

  const openProfileModal = () => {
    setProfileOpen(true); // Open profile modal
  };

  useEffect(() => {
    // Logic for loading profile data can go here if needed
  }, [user]);

  return (
    <div className='bg-white sticky top-0 z-50'>
      {/* Profile Modal */}
      <Transition.Root show={profileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setProfileOpen}>
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <RxCross2 size={20} onClick={closeProfileModal} className="cursor-pointer" />
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <img
                    src="/image/pr.webp"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-medium text-sm">{user?.user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-olive-500 px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{
            backgroundColor: mode === 'dark' ? 'rgb(62 64 66)' : '',
            color: mode === 'dark' ? 'white' : '',
          }}>
          <span
            style={{
              animation: 'blink 1.5s infinite',
              display: 'inline-block',
            }}
          >
            "Get 20% off on all clothing – Limited time only!"
          </span>
        </p>

        <nav aria-label="Top" className="bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-xl" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
          <div className="flex h-16 items-center">
            <button
              type="button"
              className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
              onClick={() => setOpen(true)} style={{ backgroundColor: mode === 'dark' ? 'rgb(80 82 87)' : '', color: mode === 'dark' ? 'white' : '', }}>
              <span className="sr-only">Open menu</span>
            </button>

            {/* Logo Design with Shopping Bag Icon on the Right */}
            <div className="ml-4 flex lg:ml-0 items-center relative">
              <Link to={'/'} className='flex items-center'>
                <h1
                  className="text-4xl font-bold tracking-wide logo-text z-10"
                  style={{
                    fontFamily: '"Pacifico", cursive',
                    color: mode === 'dark' ? '#B5651D' : '#3E2723',
                    display: 'flex',
                    alignItems: 'center',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <span style={{
                    color: mode === 'dark' ? '#8B4513' : '#8B4513',
                    fontWeight: '900',
                    fontSize: '1.3em',
                    marginRight: '2px',
                    letterSpacing: '1px',
                    transform: 'rotate(-5deg)',
                  }}>S</span>
                  <span style={{ transform: 'rotate(3deg)' }}>h</span>
                  <span style={{ transform: 'rotate(-2deg)' }}>o</span>
                  <span style={{ transform: 'rotate(2deg)' }}>p</span>
                  <span style={{ transform: 'rotate(-3deg)' }}>E</span>
                  <span style={{ transform: 'rotate(4deg)' }}>a</span>
                  <span style={{ transform: 'rotate(-2deg)' }}>s</span>
                  <span style={{ transform: 'rotate(3deg)' }}>e</span>
                </h1>
              </Link>
              {/* Shopping Bag Icon */}
              <FaShoppingBag
                size={30}
                className="ml-3 text-gray-700"
                style={{ color: mode === 'dark' ? '#B5651D' : '#333333' }}
              />
            </div>

            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {/* Navigation Links */}
                <Link to={'/allproducts'} className="text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '', }}>
                  All Products
                </Link>

                {user ? (
                  <Link to={'/order'} className="text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Order
                  </Link>
                ) : (
                  <Link to={'/signup'} className="text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Signup
                  </Link>
                )}

                {/* Admin Link */}
                {user?.user?.email === 'admin011@gmail.com' && (
                  <Link to={'/dashboard'} className="text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Admin
                  </Link>
                )}

                {/* Logout */}
                {user && (
                  <a onClick={logout} className="text-sm font-medium text-gray-700 cursor-pointer" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Logout
                  </a>
                )}
              </div>

              <div className="flex lg:ml-6">
                <button onClick={toggleMode}>
                  {mode === 'light' ? (
                    <FiSun size={30} />
                  ) : (
                    <BsFillCloudSunFill size={30} />
                  )}
                </button>
              </div>

              <div className="ml-4 flex items-center lg:ml-6 space-x-4">
                <Link to={'/cart'} className="group -m-2 flex items-center p-2" style={{ color: mode === 'dark' ? 'white' : '', }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    {cartItems.length}
                  </span>
                </Link>
                {user && (
                  <Link to={'/wishlist'} className="group -m-2 flex items-center p-2" style={{ color: mode === 'dark' ? 'white' : '', }}>
                    <AiOutlineHeart size={25} className="mr-2 text-black-500" />
                  </Link>
                )}

                {/* Profile */}
                <div onClick={openProfileModal} className="cursor-pointer w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/image/pr.webp"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Adding the @keyframes directly */}
      <style>
        {`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Navbar;
