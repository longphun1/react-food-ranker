import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaces } from "../../components/shared-types";
import axios from "axios";
import { GoogleGeoCodeResponse } from "../../components/shared-types";
import "./view-food-place.styles.scss";

const ViewFoodPlace = () => {
  const [foodPlace, setFoodPlace] = useState<FoodPlaces[]>([]);

  const { id } = useParams();
  const { foodCategoryID } = useParams();

  const foodPlaceRef = collection(db, `foodCategory/${foodCategoryID}/places/`);

  let address: string = "";

  useEffect(() => {
    const getFoodPlace = async () => {
      const data = await getDocs(foodPlaceRef);
      setFoodPlace(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodPlace: doc.data().foodPlace,
          foodLocation: doc.data().foodLocation,
          foodNote: doc.data().foodNote,
        }))
      );
    };
    getFoodPlace();
  }, []);

  foodPlace.forEach((foodPlace) => {
    if (foodPlace.id === id) {
      address = foodPlace.foodLocation!;
    }
  });

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    address
  )}&key=${process.env.REACT_APP_API_KEY}`;

  axios
    .get<GoogleGeoCodeResponse>(geocodeUrl)
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coordinates = response.data.results[0].geometry.location;

      const map = new google.maps.Map(
        document.getElementById("google-map") as HTMLElement,
        {
          center: coordinates,
          zoom: 16,
        }
      );

      new google.maps.Marker({
        map: map,
        position: coordinates,
        title: "Uluru",
      });
    })
    .catch((err) => {
      console.log(err);
    });

  const updateRecommendation = async (id: string) => {
    const foodDoc = doc(db, `foodCategory/${foodCategoryID}/places/`, id);
    const newField = { foodRecommendationCount: +1 };
    await updateDoc(foodDoc, newField);
    window.location.reload();
    alert("You have recommended this place.");
  };

  return (
    <div>
      {foodPlace.map((place) => {
        return (
          <Fragment key={place.id}>
            {place.id === id ? (
              <div className="view-place-container">
                <div id="google-map"></div>
                <div className="view-place-info-container">
                  <h3 className="view-place-info">
                    {place.foodPlace},{" "}
                    <span className="food-place-item-name">
                      {place.foodPlaceItemName}
                    </span>{" "}
                    <span className="rating">
                      {place.foodRating}/5{" "}
                      <span className="stars">&#9733;</span>
                    </span>
                  </h3>
                  <h3 className="view-place-info">{place.foodLocation}</h3>
                </div>
                <div className="recommendation-container">
                  <h3 className="recommend-text">
                    Would you recommend this place?
                  </h3>
                  <button
                    className="thumbs-up-btn"
                    onClick={() => {
                      updateRecommendation(id);
                    }}
                  >
                    &#128077;
                  </button>
                </div>
                {place.foodNote ? (
                  <h3 className="view-place-notes">
                    Notes: <span className="notes-text">{place.foodNote}</span>
                  </h3>
                ) : (
                  <h3 className="view-place-notes">No notes</h3>
                )}
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ViewFoodPlace;
