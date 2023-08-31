import { FoodPlaceProps } from "../shared-types";
import { useNavigate } from "react-router-dom";
import "./view-category-place.styles.scss";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useState } from "react";

const ViewCategoryPlace = ({
  food,
  foodCategoryID,
  foodName,
  foodLength,
  index,
}: FoodPlaceProps) => {
  const [toggleStates, setToggleStates] = useState<boolean[]>(
    Array(foodLength).fill(false)
  );
  const { id, foodPlace, foodRating } = food;

  const navigate = useNavigate();

  const toggleKabobMenu = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  const deleteFoodPlace = async (id: string) => {
    const foodPlaceDoc = doc(db, `foodCategory/${foodCategoryID}/places/${id}`);
    await deleteDoc(foodPlaceDoc);
    window.location.reload();
  };

  const goToViewFood = () => {
    navigate(`/view/${foodCategoryID}/${foodPlace}/${id}`);
  };

  const goToUpdateFood = () => {
    navigate(`/update/${foodName}/${foodCategoryID}/${foodPlace}/${id}`);
  };

  return (
    <div className="view-category-place-container">
      <h3 className="food-place-link" onClick={goToViewFood}>
        {foodPlace} <span className="rating">{foodRating / 2} &#9733;</span>
      </h3>
      <div className="menu-btn-container">
        <div
          className="btns-container"
          id={toggleStates[index!] ? "hidden" : ""}
        >
          <button className="category-btns" onClick={goToUpdateFood}>
            Update
          </button>
          <button
            className="category-btns"
            id="delete"
            onClick={() => {
              deleteFoodPlace(id);
            }}
          >
            Delete
          </button>
        </div>
        <span className="kabob-menu" onClick={() => toggleKabobMenu(index!)}>
          &#10247;
        </span>
      </div>
    </div>
  );
};

export default ViewCategoryPlace;
