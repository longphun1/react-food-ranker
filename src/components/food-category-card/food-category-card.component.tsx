import "./food-category-card.styles.scss";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useEffect, useState } from "react";
import { FoodCategoryCardProps } from "../shared-types";

type FoodPlaces = {
  id: string;
  foodPlace: string;
};

const FoodCategoryCard = ({ foodItem }: FoodCategoryCardProps) => {
  const { id, foodName } = foodItem;
  const [foodPlaces, setFoodPlaces] = useState<FoodPlaces[]>([]);

  const navigate = useNavigate();

  const foodPlacesRef = collection(db, `foodCategory/${id}/places`);

  useEffect(() => {
    const getFoodPlaces = async () => {
      const data = await getDocs(foodPlacesRef);
      setFoodPlaces(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodPlace: doc.data().foodPlace,
        }))
      );
    };

    getFoodPlaces();
  }, []);

  const goToAdd = () => {
    navigate(`/add/${foodName}/${id}`);
  };

  return (
    <div className="food-card-container">
      <div className="food-category-name-container">
        <h2 className="food-category-name">{foodName}</h2>
      </div>
      {foodPlaces.map((food) => {
        return (
          <div key={food.id}>
            <h2 className="">{food.foodPlace}</h2>
          </div>
        );
      })}
      <button onClick={goToAdd}>ADD</button>
    </div>
  );
};

export default FoodCategoryCard;
