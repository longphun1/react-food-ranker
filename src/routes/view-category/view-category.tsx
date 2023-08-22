import { useParams, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaces } from "../../components/shared-types";
import "./view-category.styles.scss";
import ViewCategoryPlace from "../../components/view-category-place/view-category-place.component";

const ViewCategory = () => {
  const [foodPlaces, setFoodPlaces] = useState<FoodPlaces[]>([]);

  const { id } = useParams();
  const { foodName } = useParams();

  const navigate = useNavigate();

  const foodPlacesRef = collection(db, `foodCategory/${id}/places`);

  const sortFoodPlacesBasedOnRating = [...foodPlaces].sort(
    (a, b) => b.foodRating - a.foodRating
  );

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

  const goBackHandler = () => {
    navigate("/");
  };

  const goToAdd = () => {
    navigate(`/add/${foodName}/${id}`);
  };

  return (
    <div className="view-category-container">
      <div className="go-back-btn-container">
        <span className="go-back-btn" onClick={goBackHandler}>
          &#8617;
        </span>
      </div>
      <div className="view-category-sub-container">
        <div className="view-category-box">
          <span className="foodName-title">{foodName}</span>
          {foodPlaces.length ? (
            <Fragment>
              {sortFoodPlacesBasedOnRating.map((food) => {
                return (
                  <div className="view-category-place" key={food.id}>
                    <ViewCategoryPlace
                      food={food}
                      foodCategoryID={id}
                      foodName={foodName}
                    />
                  </div>
                );
              })}
            </Fragment>
          ) : (
            <div>
              <p className="no-collection">You have no collection</p>
              <button className="go-to-add-btn" onClick={goToAdd}>
                ADD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
