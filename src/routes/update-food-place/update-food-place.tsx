import "./update-food-place.styles.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { FoodPlaces } from "../../components/shared-types";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { FoodPlaceValSchema } from "../../validations/FoodPlaceValidations";
import { StandaloneSearchBox } from "@react-google-maps/api";

const UpdateFoodPlace = () => {
  const [foodPlaces, setFoodPlaces] = useState<FoodPlaces[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const { foodName } = useParams();
  const { foodCategoryID } = useParams();

  // let food: any = "";

  const foodPlacesRef = collection(
    db,
    `foodCategory/${foodCategoryID}/places/`
  );

  const foodPlaceDoc = doc(db, `foodCategory/${foodCategoryID}/places/${id}`);

  useEffect(() => {
    const getFoodPlace = async () => {
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
      {foodPlaces.map((food) => {
        return (
          <Fragment key={food.id}>
            {food.id === id ? (
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
                        placeholder={"Name: " + food.foodPlace}
                        {...formik.getFieldProps("foodPlace")}
                      />
                    </div>
                    <div className="add-food-input-container">
                      {formik.touched.foodPlaceItemName &&
                      formik.errors.foodPlaceItemName ? (
                        <div className="error">
                          {formik.errors.foodPlaceItemName}
                        </div>
                      ) : null}
                      <input
                        className="add-food-place-input"
                        placeholder={"Item: " + food.foodPlaceItemName}
                        {...formik.getFieldProps("foodPlaceItemName")}
                      />
                    </div>
                    <div className="add-food-input-container">
                      {formik.touched.foodPlaceItemPrice &&
                      formik.errors.foodPlaceItemPrice ? (
                        <div className="error">
                          {formik.errors.foodPlaceItemPrice}
                        </div>
                      ) : null}
                      <input
                        className="add-food-place-input"
                        placeholder={"Price: $" + food.foodPlaceItemPrice}
                        type="number"
                        {...formik.getFieldProps("foodPlaceItemPrice")}
                      />
                    </div>
                    <div className="add-food-input-container">
                      {formik.touched.foodAddress &&
                      formik.errors.foodAddress ? (
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
                          placeholder={"Address: " + food.foodAddress}
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
                        placeholder={"Rating: " + food.foodRating}
                        {...formik.getFieldProps("foodRating")}
                      />
                    </div>
                    <div className="add-food-input-container">
                      <input
                        className="add-food-place-input"
                        placeholder={
                          food.foodNote ? "Notes: " + food.foodNote : "No notes"
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
            ) : null}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default UpdateFoodPlace;
