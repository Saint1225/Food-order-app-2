import { useState, useEffect } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {

  const [loadedMeals, setLoadedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    let timer;
    const fetchData = async () => {
      clearTimeout(timer);
      try {
        const response = await fetch("https://react-http-2bc42-default-rtdb.asia-southeast1.firebasedatabase.app/meals.json", {
          method: "GET"
        });
        if (!response.ok) {
          throw new Error ("Fetch issue!");
        }
        const meals = await response.json();
        const mealsArray = Object.keys(meals).map(key => (
            {
              id: key,
              name: meals[key].name,
              description: meals[key].description,
              price: meals[key].price,
            })
          );
        setLoadedMeals(mealsArray);
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000)
      }
      catch (error) {
        console.log(error)
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mealsList = loadedMeals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {error && <p>{error}</p>}
        {isLoading ? <p>Loading...</p> : <ul>{mealsList}</ul>}
      </Card>
    </section>
  );
};

export default AvailableMeals;
