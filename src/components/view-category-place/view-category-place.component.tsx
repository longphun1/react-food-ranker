import { FoodPlaceProps } from "../shared-types";
import { useNavigate } from "react-router-dom";
import "./view-category-place.styles.scss";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";

const ViewCategoryPlace = ({
  food,
  foodCategoryID,
  foodName,
}: FoodPlaceProps) => {
  const { id, foodPlace, foodRating } = food;

  const navigate = useNavigate();

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
      <div className="btns-container">
        <button className="update-delete-btn" onClick={goToUpdateFood}>
          Update
        </button>
        <button
          className="update-delete-btn"
          onClick={() => {
            deleteFoodPlace(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewCategoryPlace;
