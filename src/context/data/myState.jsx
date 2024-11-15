import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import { collection, addDoc, doc, onSnapshot, deleteDoc, setDoc, getDocs, QuerySnapshot, query, Timestamp, orderBy } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';

function myState(props) {
  const [mode, setMode] = useState('light');


  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = "rgb(17, 24, 39)";
    }
    else {
      setMode('light');
      document.body.style.backgroundColor = "white";

    }
  }
  const [loading, setLoading] = useState(false);
  const [products, setproducts] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",

      }
    )

  });
  const addProduct = async () => {
    if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
      //return toast.error('Please fill all fields')
      return toast.error('Please fill all fields')
    }
    const productRef = collection(fireDB, "products")
    setLoading(true)
    try {
      //const productRef = collection(fireDb, "products")

      await addDoc(productRef, products)
      //toast.success("Product Add successfully")
      toast.success("Product Add successfully")
      setTimeout(() => {
        window.location.href = '/dashboard'
      }
      );
      getProductData()
      closeModal()
      setLoading(false)
    }
    catch (error) {
      console.log(error)
      setLoading(false)
    }
    setproducts("")
  }

  const [product, setProduct] = useState([]);

  const getProductData = async () => {
    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productArray)
        setLoading(false);
      });
      return () => data;


    }
    catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    getProductData();
  }, []);

  //update product function
  const edithandle = (item) => {
    setproducts(item)
  }
  // update product
  const updateProduct = async () => {
    setLoading(true)
    try {

      await setDoc(doc(fireDB, 'products', products.id), products)
      toast.success("Product Updated successfully")

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 800);
      getProductData();
      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  // delete product
  const deleteProduct = async (item) => {

    try {
      setLoading(true)
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success('Product Deleted successfully')
      setLoading(false)
      getProductData()
    } catch (error) {
      // toast.success('Product Deleted Falied')
      setLoading(false)
    }
  }

  const [order, setOrder] = useState([]);

  const getOrderData = async () => {
      setLoading(true)
      try {
          const result = await getDocs(collection(fireDB, "order"))
          const ordersArray = [];
          result.forEach((doc) => {
              ordersArray.push(doc.data());
              setLoading(false)
          });
          setOrder(ordersArray);
          console.log(ordersArray)
          setLoading(false);
      } catch (error) {
          console.log(error)
          setLoading(false)
      }
  }

  const [user, setUser] = useState([]);

  const getUserData = async () => {
      setLoading(true)
      try {
          const result = await getDocs(collection(fireDB, "users"))
          const usersArray = [];
          result.forEach((doc) => {
              usersArray.push(doc.data());
              setLoading(false)
          });
          setUser(usersArray);
          console.log(usersArray)
          setLoading(false);
      } catch (error) {
          console.log(error)
          setLoading(false)
      }
  }

  useEffect(() => {
      getOrderData();
      getUserData();
      getProductData();
  }, []);


  const [searchkey, setSearchkey] = useState('')
  const[filterType , setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  


  return (
    <MyContext.Provider value={{ mode, toggleMode, loading, setLoading, products, setproducts, addProduct, edithandle, updateProduct, deleteProduct, product , order, user ,
     searchkey,setSearchkey,filterType ,setFilterType , filterPrice ,setFilterPrice }}>

      {props.children}

    </MyContext.Provider>
  )
}

export default myState