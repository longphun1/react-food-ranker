import "./food-category-card.styles.scss";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useEffect, useState } from "react";
import { FoodCategoryCardProps } from "../shared-types";
import { FoodPlaces } from "../shared-types";
import FoodPlace from "../food-place/food-place.component";

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
          foodPlaceItemName: doc.data().foodPlaceItemName,
          foodPlaceItemPrice: doc.data().foodPlaceItemPrice,
          foodRating: doc.data().foodRating,
          foodAddress: doc.data().foodAddress,
          foodNote: doc.data().foodNote,
        }))
      );
    };

    getFoodPlaces();
  }, []);

  const viewFoodCategory = () => {
    navigate(`/view/${foodName}/${id}/all`);
  };

  const goToAdd = () => {
    navigate(`/add/${foodName}/${id}`);
  };

  return (
    <div className="food-card-container">
      <div className="food-category-name-container">
        <h2 className="food-category-name">{foodName}</h2>
        <button className="view-food-category-btn" onClick={viewFoodCategory}>
          View
        </button>
      </div>
      {foodPlaces.map((food) => {
        return (
          <div key={food.id}>
            <FoodPlace food={food} foodCategoryID={id} />
          </div>
        );
      })}
      <button onClick={goToAdd}>ADD</button>
    </div>
  );
};

export default FoodCategoryCard;
