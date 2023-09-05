import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase/firebase.utils";
import { useFormik } from "formik";
import { FoodPlaceValSchema } from "../../validations/FoodPlaceValidations";
import { StandaloneSearchBox } from "@react-google-maps/api";
import "./add-food.styles.scss";

const AddFood = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { foodName } = useParams();

  const FoodPlaceCollectionRef = collection(db, `foodCategory/${id}/places/`);

  const capitalizeString = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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
      const formattedPrice = parseFloat(values.foodPlaceItemPrice).toFixed(2);

      await addDoc(FoodPlaceCollectionRef, {
        foodPlace: capitalizeString(values.foodPlace),
        foodPlaceItemName: capitalizeString(values.foodPlaceItemName),
        foodPlaceItemPrice: formattedPrice,
        foodAddress: values.foodAddress,
        foodRating: values.foodRating,
        foodNote: capitalizeString(values.foodNote),
        foodRecommendationCount: values.foodRecommendationCount,
      });
      navigate("/");
    },
  });

  const goBackHandler = () => {
    navigate("/home");
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult) => {
    formik.setFieldValue("foodAddress", place.formatted_address);
  };

  return (
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
              placeholder="Name of place"
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
              placeholder="Item name"
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
              placeholder="Item Price"
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
                placeholder="Enter an address"
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
              placeholder="Rating (1-10)"
              {...formik.getFieldProps("foodRating")}
            />
          </div>
          <div className="add-food-input-container">
            <input
              className="add-food-place-input"
              placeholder="Note (optional)"
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
  );
};

export default AddFood;
