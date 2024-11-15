import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { FaShoppingBag } from 'react-icons/fa'; // Import the shopping bag icon

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(""); // State to store email validation error
    const [passwordError, setPasswordError] = useState(""); // State to store password validation error
    const [nameError, setNameError] = useState(""); // State to store name validation error

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // Function to handle regular email signup
    const signup = async () => {
        // Input validation
        if (name === "" || email === "" || password === "") {
            return toast.error("All fields are required");
        }

        // Validate email format before proceeding
        if (emailError !== "") {
            return toast.error("Please enter a valid email address");
        }
        
        // Validate password format before proceeding
        if (passwordError !== "") {
            return toast.error("Password does not meet requirements");
        }

        setLoading(true); // Start loading state

        try {
            // Create user with Firebase Auth
            const users = await createUserWithEmailAndPassword(auth, email, password);
            console.log(users);

            const user = {
                name: name,
                email: users.user.email,
                uid: users.user.uid,
                time: Timestamp.now(),
            };

            // Save user to Firestore
            const userRef = collection(fireDB, "users");
            await addDoc(userRef, user);
            toast.success("Signup successful");

            // Reset form fields and loading state
            setName("");
            setEmail("");
            setPassword("");
            setLoading(false);

        } catch (error) {
            setLoading(false); // Stop loading on error
            console.error(error);
            let errorMessage = "An error occurred during signup";
            
            // Firebase specific error handling
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format";
            }

            toast.error(errorMessage);
        }
    };

    // Function to handle Google SignIn
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setLoading(true); // Show loading state while signing in

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user is already in Firestore, else add new user
            const userRef = collection(fireDB, "users");
            const userData = {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                time: Timestamp.now(),
            };

            // Add new user to Firestore if needed
            await addDoc(userRef, userData);

            toast.success("Google Sign-In successful");

            setLoading(false);
        } catch (error) {
            setLoading(false); // Stop loading on error
            console.error(error);
            toast.error("Failed to sign in with Google");
        }
    };

    // Function to handle email input change with validation (valid email format)
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Regular expression for email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(value)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError(""); // Clear error if valid email
        }
    };

    // Function to handle password input change with validation (strength check)
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Regular expression for password validation (min 6 chars, 1 uppercase, 1 number, 1 special character)
        const passwordRegex = password.length<6;
        if (!passwordRegex.test(value)) {
            setPasswordError("Password must be at least 6 characters");
        } else {
            setPasswordError(""); // Clear error if valid password
        }
    };

    // Function to handle name input change with validation (letters only)
    const handleNameChange = (e) => {
        const value = e.target.value;
        const regex = /^[A-Za-z\s]*$/; // Only letters and spaces allowed
        if (regex.test(value) || value === "") {
            setName(value);
            setNameError(""); // Clear error if valid input
        } else {
            setNameError("Only letters are allowed in the name");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && <Loader />}
            <div className='absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center'>
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
            <div className="bg-gray-800 px-10 py-10 rounded-xl w-full max-w-md">
                <h1 className="text-center text-white text-xl mb-6 font-bold">Signup</h1>

                {/* Name input for email signup */}
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange} // Use the updated handler
                    name="name"
                    className="bg-gray-600 mb-4 px-4 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
                    placeholder="Name"
                />
                {nameError && <p className="text-red-500 text-sm">{nameError}</p>} {/* Show error message */}

                {/* Email input for email signup */}
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange} // Use the updated handler
                    name="email"
                    className="bg-gray-600 mb-4 px-4 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
                    placeholder="Email"
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>} {/* Show email validation error */}

                {/* Password input for email signup */}
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange} // Use the updated handler
                    className="bg-gray-600 mb-4 px-4 py-2 w-full rounded-lg text-white placeholder:text-gray-200 outline-none"
                    placeholder="Password"
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* Show password validation error */}
                
                <div className="flex justify-center mb-3">
                    {/* Regular signup button */}
                    <button
                        onClick={signup}
                        className="bg-olive-500 w-full text-black font-bold px-4 py-2 rounded-lg"
                    >
                        Signup
                    </button>
                </div>

                {/* OR text separator */}
                <div className="flex justify-center my-4">
                    <span className="text-white text-lg font-bold">----- OR -----</span>
                </div>

                {/* Google SignIn button */}
                <div className="flex justify-center mb-3">
                    <button 
                        onClick={googleSignIn}
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
                </div>

                <div>
                    <h2 className="text-white">
                        Have an account?{" "}
                        <Link className="text-cyan-500 font-bold" to="/login">
                            Login
                        </Link>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Signup;
