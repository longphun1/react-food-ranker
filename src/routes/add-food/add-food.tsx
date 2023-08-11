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

  const formik = useFormik({
    initialValues: {
      foodPlace: "",
      foodLocation: "",
      foodRating: "",
      foodNote: "",
    },
    validationSchema: FoodPlaceValSchema,
    onSubmit: async (values) => {
      await addDoc(FoodPlaceCollectionRef, {
        foodPlace: values.foodPlace,
        foodLocation: values.foodLocation,
        foodRating: values.foodRating,
        foodNote: values.foodNote,
      });
      navigate("/");
    },
  });

  const onPlaceSelect = (place: any) => {
    formik.setFieldValue("foodLocation", place.formatted_address);
  };

  return (
    <div className="add-food-container">
      <form onSubmit={formik.handleSubmit}>
        <div>
          {formik.touched.foodPlace && formik.errors.foodPlace ? (
            <div className="error">{formik.errors.foodPlace}</div>
          ) : null}
          <input
            className="add-food-place-input"
            placeholder="Name of place"
            {...formik.getFieldProps("foodPlace")}
          />
        </div>
        <div>
          {formik.touched.foodLocation && formik.errors.foodLocation ? (
            <div className="error">{formik.errors.foodLocation}</div>
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
              placeholder="Enter a location"
              {...formik.getFieldProps("foodLocation")}
            />
          </StandaloneSearchBox>
        </div>
        <div>
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
        <div>
          <input
            className="add-food-place-input"
            placeholder="Note (optional)"
            {...formik.getFieldProps("foodNote")}
          />
        </div>
        <button className="add-food-place-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddFood;
