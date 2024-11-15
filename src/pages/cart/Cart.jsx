import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, incrementQuantity, decrementQuantity } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function Cart() {
  const { mode } = useContext(myContext);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Calculate total amount and sync to local storage
  useEffect(() => {
    const tempTotal = cartItems.reduce((acc, item) => acc + parseInt(item.price) * item.quantity, 0);
    setTotalAmount(tempTotal);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const shipping = 100;
  const grandTotal = totalAmount + shipping;

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Item removed from cart');
  };

  const handleIncrement = (item) => dispatch(incrementQuantity(item));
  const handleDecrement = (item) => dispatch(decrementQuantity(item));

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error('All fields are required', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    const options = {
      key: "",
      key_secret: "",
      amount: grandTotal * 100,
      currency: 'INR',
      order_receipt: 'order_rcptid_' + name,
      name: 'ShopEase',
      description: 'for testing purpose',
      handler: async function (response) {
        toast.success('Payment Successful');
        const paymentId = response.razorpay_payment_id;

        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
          email: JSON.parse(localStorage.getItem('user')).user.email,
          userid: JSON.parse(localStorage.getItem('user')).user.uid,
          paymentId,
        };

        try {
          const orderRef = collection(fireDB, 'order');
          await addDoc(orderRef, orderInfo);
        } catch (error) {
          console.error('Error adding order to Firestore:', error);
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <Layout>
      <div
        className={`h-screen bg-gray-100 pt-5 mb-[60%] ${
          mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cartItems.map((item, index) => {
              const { title, price, description, imageUrl, size, quantity } = item;
              return (
                <div
                  key={index}
                  className={`justify-between mb-6 rounded-lg border drop-shadow-xl p-6 sm:flex sm:justify-start ${
                    mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  <img src={imageUrl} alt="product" className="w-full rounded-lg sm:w-40" />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold">{title}</h2>
                      <p className="text-sm">{description}</p>
                      <p className="mt-1 text-xs font-semibold">Price: ₹{price}</p>
                      <p className="mt-1 text-xs font-semibold">Size: {size}</p> {/* Display selected size */}
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="border rounded w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3">{quantity}</span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="border rounded w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCart(item)}
                      className="mt-4 sm:mt-0 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-6 h-full rounded-lg border p-6 shadow-md md:mt-0 md:w-1/3 ${
              mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="mb-2 flex justify-between">
              <p>Subtotal</p>
              <p>₹{totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>₹{shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">₹{grandTotal}</p>
            </div>
            <Modal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
