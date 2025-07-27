import React, { useContext, useState, useEffect } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {
  const {food_list} = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [food_list]);

  const filteredFood = food_list.filter(item => 
    category === "All" || category === item.category
  );

  if (isLoading) {
    return (
      <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className='loading-container'>
          <LoadingSpinner size="large" />
          <p className='loading-container__text'>Loading delicious food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='food-display fade-in' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {filteredFood.length > 0 ? (
          filteredFood.map((item) => (
            <FoodItem 
              key={item._id} 
              image={item.image} 
              name={item.name} 
              desc={item.description} 
              price={item.price} 
              id={item._id}
            />
          ))
        ) : (
          <div className='no-food-message'>
            <p>No dishes found in this category.</p>
            <p>Try selecting a different category!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
