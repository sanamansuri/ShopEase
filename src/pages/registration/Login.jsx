import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { FaShoppingBag } from 'react-icons/fa';

import Loader from '../../components/loader/Loader';
import myContext from '../../context/data/myContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, setLoading } = useContext(myContext);
    const navigate = useNavigate();

    // Login with email and password
    const login = async () => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            // Save user details to localStorage
            localStorage.setItem('user', JSON.stringify({
                user: {
                    email: user.email,
                    name: user.displayName,
                    uid: user.uid,
                    isGoogleLogin: false,
                }
            }));

            toast.success('Login Successfully');
            navigate('/');
        } catch (error) {
            console.log(error);
            toast.error('Login Failed');
        }
        setLoading(false);
    };

    // Google Login
    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user already exists in Firestore
            const userRef = collection(fireDB, 'users');
            const q = query(userRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Add new user to Firestore
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    time: Timestamp.now(),
                };
                await addDoc(userRef, userData);
            }

            // Save user details to localStorage
            localStorage.setItem('user', JSON.stringify({
                user: {
                    email: user.email,
                    name: user.displayName,
                    uid: user.uid,
                    isGoogleLogin: true,
                }
            }));

            toast.success("Google Sign-In successful");
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast.error("Failed to sign in with Google");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && <Loader />}
            <div className='absolute top-20 left-1/2 transform -translate-x-1/2 flex items-center'>
                {/* ShopEase Logo and Shopping Bag Icon in the same line */}
                <h1 className="text-4xl font-bold tracking-wide text-white logo-text mr-3" style={{
                    fontFamily: '"Pacifico", cursive',
                    color: '#3E2723',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                }}>
                    <span style={{
                        color: '#8B4513',
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
                <FaShoppingBag
                    size={30}
                    className="text-gray-700"
                    style={{ color: '#8B4513' }} // Color of the icon
                />
            </div>
            <div className='bg-gray-800 px-10 py-10 rounded-xl'> 
                <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
                <input
                    type="email"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none'
                    placeholder='Email'
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='bg-gray-600 mb-4 px-2 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none'
                    placeholder='Password'
                />
                <button
                    onClick={login}
                    className='bg-olive-500 w-full text-black font-bold px-2 py-2 rounded-lg mb-3'>
                    Login
                </button>
                <div className="flex justify-center my-4">
                    <span className="text-white text-lg font-bold">----- OR -----</span>
                </div>
                <button 
                    onClick={googleLogin}
                    className="bg-gray-600 w-full text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center border border-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M45.12 24.64c0-1.62-.14-3.18-.39-4.68H24v9.42h11.91c-.52 2.62-2.07 4.84-4.35 6.34v5.28h7.02c4.12-3.8 6.54-9.4 6.54-16.36z"></path>
                        <path fill="#34A853" d="M24 48c6.3 0 11.58-2.1 15.44-5.66l-7.02-5.28c-2.07 1.38-4.7 2.2-8.42 2.2-6.47 0-11.95-4.36-13.91-10.24H3.62v6.42C7.46 43.9 15.26 48 24 48z"></path>
                        <path fill="#FBBC05" d="M10.09 28.02c-.47-1.38-.73-2.84-.73-4.36s.26-2.98.73-4.36V13.88H3.62C1.98 17.06 1 20.88 1 24s.98 6.94 2.62 10.12l6.47-6.1z"></path>
                        <path fill="#EA4335" d="M24 9.5c3.42 0 6.47 1.18 8.88 3.5l6.54-6.54C35.58 2.98 30.3 1 24 1 15.26 1 7.46 5.1 3.62 11.88l6.47 6.1c1.96-5.88 7.44-10.24 13.91-10.24z"></path>
                    </svg>
                    Sign in with Google
                </button>
                <h2 className='text-white mt-4'>
                    Don't have an account? <Link className='text-cyan-500 font-bold' to={'/signup'}>Signup</Link>
                </h2>
            </div>
        </div>
    );
}

export default Login;
