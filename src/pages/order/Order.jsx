import React, { useContext } from 'react'
import myContext from '../../context/data/myContext'
import Layout from '../../components/layout/Layout'
import Loader from '../../components/loader/Loader'

function Order() {
  const userid = JSON.parse(localStorage.getItem('user')).user.uid
  const context = useContext(myContext)
  const { mode, loading, order } = context

  return (
    <Layout>
      {loading && <Loader />}
      {order.length > 0 ? (
        <>
          <div class="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
             className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900 ml-[410px] mt-[80px]"
              style={{ color: mode === 'dark' ? 'white' : '' }}
            >
              Your Orders
            </h1>

            <div class="h-1 w-20 bg-olive-500 rounded ml-[410px]"></div>
          </div>
          <div className="h-full pt-10">

            {order
              .filter((obj) => obj.userid === userid) // Filter by user id
              .map((order) => {
                return (
                  <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0" key={order.id}>
                    {order.cartItems.map((item) => {
                      return (
                        <div className="rounded-lg md:w-2/3" key={item.id}>
                          <div
                            className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                            style={{
                              backgroundColor: mode === 'dark' ? '#282c34' : '',
                              color: mode === 'dark' ? 'white' : '',
                            }}
                          >
                            <img src={item.imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                              <div className="mt-5 sm:mt-0">
                                <h2
                                  className="text-lg font-bold text-gray-900"
                                  style={{ color: mode === 'dark' ? 'white' : '' }}
                                >
                                  {item.title}
                                </h2>
                                <p
                                  className="mt-1 text-xs text-gray-700"
                                  style={{ color: mode === 'dark' ? 'white' : '' }}
                                >
                                  {item.description}
                                </p>
                                <p
                                  className="mt-1 text-xs text-gray-700"
                                  style={{ color: mode === 'dark' ? 'white' : '' }}
                                >
                                  Price: ₹{item.price}
                                </p>
                                <p
                                  className="mt-1 text-xs text-gray-700"
                                  style={{ color: mode === 'dark' ? 'white' : '' }}
                                >
                                  Size: {item.size} {/* Display Size */}
                                </p>
                                <p
                                  className="mt-1 text-xs text-gray-700"
                                  style={{ color: mode === 'dark' ? 'white' : '' }}
                                >
                                  Quantity: {item.quantity} {/* Display Quantity */}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
          </div>
        </>
      ) : (
        <h2 className="text-center tex-2xl text-white">No Orders Found</h2> // If no orders found
      )}
    </Layout>
  )
}

export default Order
