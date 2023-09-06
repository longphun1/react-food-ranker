import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaceType } from "../../components/shared-types";
import axios from "axios";
import { GoogleGeoCodeResponse } from "../../components/shared-types";
import "./view-food-place.styles.scss";

const ViewFoodPlace = () => {
  const [foodPlace, setFoodPlace] = useState<FoodPlaceType | undefined>(
    undefined
  );

  const { id } = useParams();
  const { foodCategoryID } = useParams();

  const foodPlaceDoc = doc(db, `foodCategory/${foodCategoryID}/places/${id}`);

  useEffect(() => {
    const getFoodPlace = async () => {
      try {
        const docSnapshot = await getDoc(foodPlaceDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as FoodPlaceType;
          setFoodPlace(data);

          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
            data.foodAddress
          )}&key=${process.env.REACT_APP_API_KEY}`;

          axios
            .get<GoogleGeoCodeResponse>(geocodeUrl)
            .then((response) => {
              if (response.data.status !== "OK") {
                throw new Error("Could not fetch location");
              }

              const coordinates = response.data.results[0].geometry.location;
              const placeId = response.data.results[0].place_id;

              const map = new google.maps.Map(
                document.getElementById("google-map") as HTMLElement,
                {
                  center: coordinates,
                  zoom: 16,
                }
              );

              const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json
              ?fields=name%2Crating%2Cformatted_phone_number
              &place_id=${placeId}
              &key=${process.env.REACT_APP_API_KEY}`;

              axios
                .get(placeDetailsUrl)
                .then((placeDetailsResponse) => {
                  if (placeDetailsResponse.data.status !== "OK") {
                    throw new Error("Could not fetch place details");
                  }

                  const placeDetails = placeDetailsResponse.data.result;
                  const phoneNumber = placeDetails.formatted_phone_number;

                  // Now you have the phone number
                  console.log("Phone Number:", phoneNumber);

                  // You can use this phone number as needed
                })
                .catch((err) => {
                  console.error("Error fetching place details:", err);
                });

              const marker = new google.maps.Marker({
                map: map,
                position: coordinates,
                title: "Uluru",
              });

              marker.addListener("click", () => {
                const mapsUrl = `https://www.google.com/maps/place/${coordinates.lat},${coordinates.lng}`;

                window.open(mapsUrl, "_blank");
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Food place document not found");
        }
      } catch (error) {
        console.error("Error getting food place document", error);
      }
    };
    getFoodPlace();
  }, []);

  const updateRecommendation = async (
    id: string,
    foodRecommendationCount: number
  ) => {
    const foodDoc = doc(db, `foodCategory/${foodCategoryID}/places/`, id);
    const newField = { foodRecommendationCount: foodRecommendationCount + 1 };
    await updateDoc(foodDoc, newField);
    window.location.reload();
    alert("You have recommended this place.");
  };

  return (
    <div>
      <div className="view-place-container">
        <div id="google-map"></div>
        <div className="view-place-info-container">
          <h2 className="view-place-info">
            {foodPlace?.foodPlace}
            <span className="rating">
              {(foodPlace?.foodRating ?? 0) / 2}/5{" "}
              <span className="stars">&#9733;</span>
            </span>
          </h2>
          <h3 className="food-address">{foodPlace?.foodAddress}</h3>
        </div>
        <div className="food-item-name-and-price-container">
          <h3 className="food-place-item-name">
            {foodPlace?.foodPlaceItemName}{" "}
            <span className="food-item-price">
              &#36;{foodPlace?.foodPlaceItemPrice}
            </span>
          </h3>
        </div>
        <div className="recommendation-container">
          <h3 className="recommend-text">Would you recommend this place?</h3>
          {foodPlace && foodPlace.foodRecommendationCount !== undefined && (
            <button
              className="thumbs-up-btn"
              onClick={() => {
                const recommendationCount =
                  foodPlace.foodRecommendationCount ?? 0;
                if (id) {
                  updateRecommendation(id, recommendationCount);
                }
              }}
            >
              &#128077;
            </button>
          )}
        </div>
        {foodPlace?.foodNote ? (
          <h3 className="view-place-notes">
            Notes: <span className="notes-text">{foodPlace?.foodNote}</span>
          </h3>
        ) : (
          <h3 className="view-place-notes">No notes</h3>
        )}
      </div>
    </div>
  );
};

export default ViewFoodPlace;
