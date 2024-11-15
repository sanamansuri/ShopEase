import React, { useContext } from 'react'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext'
import HeroSection from '../../components/heroSection/HeroSection'
import Filter from '../../components/filter/Filter'
import ProductCard from '../../components/productCard/ProductCard'
import Testimonial from '../../components/testimonial/Testimonial'
import Track from '../../components/track/Track'
import { Link } from 'react-router-dom'


function Home() {

 
  return (
    <Layout>
       {/* <div className="flex gap-5 justify-center">
        <button className=' bg-gray-300 p-5' onClick={()=> addCart()}>add</button>
        <button className=' bg-gray-300 p-5' onClick={()=> deleteCart()}>del</button>
      </div> */}

     <HeroSection/>
     <Filter/>
     <ProductCard/>
     <div className="flex justify-center -mt-10 mb-4">
        <Link to={'/allproducts'}>
          <button className=' bg-gray-300 px-5 py-2 rounded-xl'>See more</button>
        </Link>
      </div>
     <Track/>
     <Testimonial/>
    </Layout>
  )
}

export default Home