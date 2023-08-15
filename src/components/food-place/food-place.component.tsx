import { FoodPlaceProps } from "../shared-types";
import { useNavigate } from "react-router-dom";
import "./food-place.styles.scss";

const FoodPlace = ({ food, foodCategoryID }: FoodPlaceProps) => {
  const { id, foodPlace, foodRating } = food;

  const navigate = useNavigate();

  const goToViewFood = () => {
    navigate(`/view/${foodCategoryID}/${foodPlace}/${id}`);
  };

  return (
    <div className="food-place-link-container">
      <h3 className="food-place-link" onClick={goToViewFood}>
        {foodPlace} <span className="rating">{foodRating / 2} &#9733;</span>
      </h3>
    </div>
  );
};

export default FoodPlace;
