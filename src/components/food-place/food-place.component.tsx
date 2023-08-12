import React from "react";
import { FoodPlaceProps } from "../shared-types";
import { useNavigate } from "react-router-dom";

const FoodPlace = ({ food, foodCategoryID }: FoodPlaceProps) => {
  const { id, foodPlace, foodRating } = food;

  const navigate = useNavigate();

  const goToViewFood = () => {
    navigate(`/view/${foodCategoryID}/${foodPlace}/${id}`);
  };

  return (
    <div>
      <h3 onClick={goToViewFood}>
        {foodPlace} {foodRating}
      </h3>
    </div>
  );
};

export default FoodPlace;
