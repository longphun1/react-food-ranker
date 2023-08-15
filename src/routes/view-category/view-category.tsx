import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaces } from "../../components/shared-types";
import "./view-category.styles.scss";
import ViewCategoryPlace from "../../components/view-category-place/view-category-place.component";

const ViewCategory = () => {
  const [foodPlaces, setFoodPlaces] = useState<FoodPlaces[]>([]);

  const { id } = useParams();
  const { foodName } = useParams();

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

  return (
    <div className="view-category-container">
      <div className="view-category-sub-container">
        <h2 className="foodName-title">{foodName}</h2>
        {foodPlaces.map((food) => {
          return (
            <div className="view-category-place" key={food.id}>
              <ViewCategoryPlace food={food} foodCategoryID={id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCategory;
