import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useParams } from 'react-router-dom';
import { fireDB } from '../../firebase/FirebaseConfig';
import { doc, getDoc, collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ProductInfo() {
    const { loading, setLoading } = useContext(myContext);
    const [products, setProducts] = useState({});
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [user, setUser] = useState(null); // State to hold user data
    const params = useParams();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    const getProductData = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", params.id));
            setProducts(productTemp.data());
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getReviews = async () => {
        const reviewsRef = collection(fireDB, "reviews");
        const q = query(reviewsRef, where("productId", "==", params.id));
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setReviews(fetchedReviews);
    };

    const addReview = async () => {
        if (!newReview || rating === 0) {
            toast.error("Please provide a review and rating");
            return;
        }

        try {
            const userName = user ? user.displayName || user.email : "Guest User"; // Use displayName or email if available
            await addDoc(collection(fireDB, "reviews"), {
                productId: params.id,
                review: newReview,
                rating: rating,
                userName: userName,
                createdAt: Timestamp.now(),
            });

            setNewReview('');
            setRating(0);
            toast.success("Review submitted successfully");
            getReviews(); // Fetch updated reviews
        } catch (error) {
            console.error("Error submitting review: ", error);
            toast.error("Failed to submit review");
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            await deleteDoc(doc(fireDB, "reviews", reviewId));
            toast.success("Review deleted");
            getReviews(); // Fetch updated reviews
        } catch (error) {
            console.error("Error deleting review: ", error);
            toast.error("Failed to delete review");
        }
    };

    const addCart = (products) => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        dispatch(addToCart({ ...products, quantity, size: selectedSize }));
        toast.success('Added to cart');
    };

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    useEffect(() => {
        getProductData();
        getReviews();

        // Check if the user is logged in and update user state
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <Layout>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-32 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img
                            alt="ecommerce"
                            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                            src={products.imageUrl}
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                {products.title}
                            </h2>
                            <p className="leading-relaxed mb-5">{products.description}</p>
                            <span className="title-font font-medium text-2xl text-gray-900">
                                ₹{products.price}
                            </span>

                            <div className="mt-4">
                                <p>Select Size:</p>
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`mr-2 px-3 py-1 rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'border'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center">
                                <button 
                                    onClick={decrementQuantity} 
                                    className="text-2xl border px-3 py-1 hover:bg-gray-200 rounded"
                                    disabled={quantity === 1}
                                >
                                    -
                                </button>
                                <span className="mx-4 text-xl">{quantity}</span>
                                <button 
                                    onClick={incrementQuantity} 
                                    className="text-2xl border px-3 py-1 hover:bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <button onClick={() => addCart(products)} className="flex mt-4 text-white bg-olive-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                                Add To Cart
                            </button>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold">Write a Review</h2>

                        {/* Star Rating */}
                        <div className="mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* Textbox to write a review */}
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            rows="4"
                            placeholder="Write your review here..."
                            className="mt-4 w-full p-3 border border-gray-300 rounded"
                        />

                        {/* Submit Review */}
                        <button onClick={addReview} className="mt-4 px-6 py-2 bg-olive-500 text-white rounded">
                            Submit Review
                        </button>

                        {/* Display Reviews */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold">Reviews</h3>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="mt-4 p-4 border rounded">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">{review.userName}</span>
                                        </div>
                                        <p className="mt-2">{review.review}</p>

                                        {/* Delete Option */}
                                        {review.userName === (user ? user.displayName || user.email : "Guest User") && (
                                            <button onClick={() => deleteReview(review.id)} className="mt-2 text-red-500 text-sm">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default ProductInfo;
