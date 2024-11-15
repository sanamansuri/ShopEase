import React, { useState, useEffect } from 'react';

function HeroSection() {
  // Array of image sources
  const images = [
    '/image/Group 1.jpg',
    '/image/4 (2).jpg',
    '/image/img11.png',
    
  ];

  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use useEffect to automatically slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // Change image every 3 seconds

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section">
      <div className="image-slider">
        <img src={images[currentImageIndex]} alt="Hero" />
      </div>
    </div>
  );
}

export default HeroSection;
