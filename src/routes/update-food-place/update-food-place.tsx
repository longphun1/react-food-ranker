import "./update-food-place.styles.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { FoodPlaceType } from "../../components/shared-types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { FoodPlaceValSchema } from "../../validations/FoodPlaceValidations";
import { StandaloneSearchBox } from "@react-google-maps/api";

const UpdateFoodPlace = () => {
  const [foodPlace, setFoodPlace] = useState<FoodPlaceType | undefined>(
    undefined
  );

  const navigate = useNavigate();
  const { id } = useParams();
  const { foodName } = useParams();
  const { foodCategoryID } = useParams();

  // let food: any = "";

  const foodPlaceDoc = doc(db, `foodCategory/${foodCategoryID}/places/${id}`);

  useEffect(() => {
    const getFoodPlace = async () => {
      try {
        const docSnapshot = await getDoc(foodPlaceDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as FoodPlaceType;
          setFoodPlace(data);
        } else {
          console.log("Food place document not found");
        }
      } catch (error) {
        console.error("Error getting food place document", error);
      }
    };
    getFoodPlace();
  }, []);

  // foodPlaces.forEach((foodPlace) => {
  //   if (foodPlace.id === id) {
  //     food = foodPlace;
  //   }
  // });

  const formik = useFormik({
    initialValues: {
      foodPlace: "",
      foodPlaceItemName: "",
      foodPlaceItemPrice: "",
      foodAddress: "",
      foodRating: "",
      foodNote: "",
      foodRecommendationCount: 0,
    },
    validationSchema: FoodPlaceValSchema,
    onSubmit: async (values) => {
      await updateDoc(foodPlaceDoc, {
        foodPlace: values.foodPlace,
        foodPlaceItemName: values.foodPlaceItemName,
        foodPlaceItemPrice: values.foodPlaceItemPrice,
        foodAddress: values.foodAddress,
        foodRating: values.foodRating,
        foodNote: values.foodNote,
        foodRecommendationCount: values.foodRecommendationCount,
      });
      navigate(`/view/${foodName}/${foodCategoryID}/all`);
    },
  });

  const onPlaceSelect = (place: google.maps.places.PlaceResult) => {
    formik.setFieldValue("foodAddress", place.formatted_address);
  };

  const goBackHandler = () => {
    navigate(`/view/${foodName}/${foodCategoryID}/all`);
  };

  return (
    <Fragment>
      <div className="add-food-container">
        <div className="go-back-btn-container">
          <span className="go-back-btn" onClick={goBackHandler}>
            &#8617;
          </span>
        </div>
        <div className="add-food-sub-container">
          <form onSubmit={formik.handleSubmit}>
            <div className="add-food-input-container">
              {formik.touched.foodPlace && formik.errors.foodPlace ? (
                <div className="error">{formik.errors.foodPlace}</div>
              ) : null}
              <input
                className="add-food-place-input"
                placeholder={"Name: " + foodPlace?.foodPlace}
                {...formik.getFieldProps("foodPlace")}
              />
            </div>
            <div className="add-food-input-container">
              {formik.touched.foodPlaceItemName &&
              formik.errors.foodPlaceItemName ? (
                <div className="error">{formik.errors.foodPlaceItemName}</div>
              ) : null}
              <input
                className="add-food-place-input"
                placeholder={"Item: " + foodPlace?.foodPlaceItemName}
                {...formik.getFieldProps("foodPlaceItemName")}
              />
            </div>
            <div className="add-food-input-container">
              {formik.touched.foodPlaceItemPrice &&
              formik.errors.foodPlaceItemPrice ? (
                <div className="error">{formik.errors.foodPlaceItemPrice}</div>
              ) : null}
              <input
                className="add-food-place-input"
                placeholder={"Price: $" + foodPlace?.foodPlaceItemPrice}
                type="number"
                {...formik.getFieldProps("foodPlaceItemPrice")}
              />
            </div>
            <div className="add-food-input-container">
              {formik.touched.foodAddress && formik.errors.foodAddress ? (
                <div className="error">{formik.errors.foodAddress}</div>
              ) : null}
              <StandaloneSearchBox
                onLoad={(searchBox) => {
                  searchBox.addListener("places_changed", () => {
                    const places = searchBox.getPlaces();
                    if (places?.length === 0) return;
                    const selectedPlace = places![0];
                    onPlaceSelect(selectedPlace);
                  });
                }}
              >
                <input
                  type="text"
                  className="add-food-place-input"
                  placeholder={"Address: " + foodPlace?.foodAddress}
                  {...formik.getFieldProps("foodAddress")}
                />
              </StandaloneSearchBox>
            </div>
            <div className="add-food-input-container">
              {formik.touched.foodRating && formik.errors.foodRating ? (
                <div className="error">{formik.errors.foodRating}</div>
              ) : null}
              <input
                className="add-food-place-input"
                type="number"
                placeholder={"Rating: " + foodPlace?.foodRating}
                {...formik.getFieldProps("foodRating")}
              />
            </div>
            <div className="add-food-input-container">
              <input
                className="add-food-place-input"
                placeholder={
                  foodPlace?.foodNote
                    ? "Notes: " + foodPlace?.foodNote
                    : "No notes"
                }
                {...formik.getFieldProps("foodNote")}
              />
            </div>
            <div>
              <button className="add-food-place-btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateFoodPlace;
