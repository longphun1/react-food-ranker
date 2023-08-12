import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, doc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaces } from "../../components/shared-types";
import axios from "axios";
import "./view-food-place.styles.scss";

type GoogleGeoCodeResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

const ViewFoodPlace = () => {
  const [foodPlace, setFoodPlace] = useState<FoodPlaces[]>([]);

  const { id } = useParams();
  const { foodCategoryID } = useParams();

  const foodPlaceRef = collection(db, `foodCategory/${foodCategoryID}/places/`);

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

  let address: string = "";

  foodPlace.forEach((foodPlace) => {
    if (foodPlace.id === id) {
      address = foodPlace.foodLocation!;
    }
  });

  axios
    .get<GoogleGeoCodeResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        address
      )}&key=${process.env.REACT_APP_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coordinates = response.data.results[0].geometry.location;

      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
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

  return (
    <div>
      {foodPlace.map((place) => {
        return (
          <Fragment key={place.id}>
            {place.id === id ? (
              <div>
                <div id="map"></div>
                <h3>{place.foodPlace}</h3>
                <h3>{place.foodLocation}</h3>
                <h3>{place.foodNote}</h3>
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ViewFoodPlace;
