import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { RootState } from "../../store/rootReducer";
import FoodCategoryCard from "../../components/food-category-card/food-category-card.component";
import "./home.styles.scss";

type FoodCategory = {
  id: string;
  foodName: string;
};

const Home = () => {
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const foodCategoriesRef = collection(db, `userFoodCategory/${uid}/foods`);

  useEffect(() => {
    const getFoodCategories = async () => {
      const data = await getDocs(foodCategoriesRef);
      setFoodCategories(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodName: doc.data().foodName,
        }))
      );
    };

    getFoodCategories();
  }, []);

  return (
    <div className="home-container">
      <div className="food-categories-container">
        {foodCategories.map((food) => {
          return (
            <div key={food.id}>
              <FoodCategoryCard foodItem={food} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
