import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../redux/wishlistSlice'; // Import the remove action

function Wishlist() {
  const context = useContext(myContext);
  const { mode, loading } = context;
  const wishlist = useSelector((state) => state.wishlist); // Access wishlist state
  const dispatch = useDispatch();

  // Function to remove item from wishlist
  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  return (
    <Layout>
      {loading && <Loader />}
      {wishlist.length > 0 ? (
        <>
          <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
              className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900 text-center mt-[50px]"
              style={{ color: mode === 'dark' ? 'white' : '' }}
            >
              Your Wishlist
            </h1>
            <div className="h-1 w-16 bg-olive-500 rounded mx-auto"></div>
          </div>
          <div className="h-full pt-8 max-w-2xl mx-auto space-y-4">
            {wishlist.map((item) => (
              <div className="rounded-lg" key={item.id}>
                <div
                  className="justify-between mb-4 rounded-lg bg-white p-4 shadow-md relative"
                  style={{
                    backgroundColor: mode === 'dark' ? '#282c34' : '',
                    color: mode === 'dark' ? 'white' : '',
                  }}
                >
                  <img src={item.imageUrl} alt="product-image" className="w-28 h-28 rounded-lg mb-3 mx-auto" />
                  <div className="text-center">
                    <h2
                      className="text-md font-semibold text-gray-900"
                      style={{ color: mode === 'dark' ? 'white' : '' }}
                    >
                      {item.title}
                    </h2>
                    <p
                      className="mt-1 text-xs text-gray-500"
                      style={{ color: mode === 'dark' ? 'white' : '' }}
                    >
                      {item.description}
                    </p>
                    <p
                      className="mt-1 text-sm text-gray-700 font-medium"
                      style={{ color: mode === 'dark' ? 'white' : '' }}
                    >
                      Price: ₹{item.price}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="mt-2 text-xs text-red-500 underline hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2 className="text-center text-lg text-white">No Items in Wishlist</h2> // If no items in wishlist
      )}
    </Layout>
  );
}

export default Wishlist;
