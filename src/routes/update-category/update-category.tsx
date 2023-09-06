import { useSelector } from "react-redux";
import { db } from "../../utils/firebase/firebase.utils";
import {
  collection,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store/rootReducer";
import { FoodCategoryValSchema } from "../../validations/FoodCategoryValidations";
import { useFormik } from "formik";
import "../add-food-category/add-food-category.styles.scss";
import { useEffect, useState } from "react";
import { FoodCategoryType } from "../../components/shared-types";

const UpdateCategory = () => {
  const [category, setCategory] = useState<FoodCategoryType | undefined>(
    undefined
  );

  const navigate = useNavigate();
  const { id } = useParams();

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const foodCollectionDoc = doc(db, `userFoodCategory/${uid}/foods/${id}`);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const docSnapshot = await getDoc(foodCollectionDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as FoodCategoryType;
          setCategory(data);
        } else {
          console.log("Category document does not exist");
        }
      } catch (error) {
        console.error("Error getting category document", error);
      }
    };
    getCategory();
  }, []);

  const formik = useFormik({
    initialValues: {
      foodName: category?.foodName || "",
      foodCuisine: category?.foodCuisine || "",
    },
    enableReinitialize: true,
    validationSchema: FoodCategoryValSchema,
    onSubmit: async (values) => {
      if (formik.isValid) {
        await updateDoc(foodCollectionDoc, {
          foodName: values.foodName,
          foodCuisine: values.foodCuisine,
        });
        navigate("/view/categories/all");
      }
    },
  });

  const goBackHandler = () => {
    navigate("/view/categories/all");
  };

  return (
    <div className="add-Food-Category-container">
      <div className="go-back-btn-container">
        <span className="go-back-btn" onClick={goBackHandler}>
          &#8617;
        </span>
      </div>
      <div className="add-food-category-sub-container">
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div>
              <span className="category-label">
                Name
                {formik.touched.foodName && formik.errors.foodName ? (
                  <span className="error">{formik.errors.foodName}</span>
                ) : null}
              </span>
            </div>

            <input
              className="add-Food-Category-Input"
              placeholder={"Name: " + category?.foodName}
              {...formik.getFieldProps("foodName")}
            />
          </div>
          <div>
            <div>
              <span className="category-label">
                Cuisine
                {formik.touched.foodCuisine && formik.errors.foodCuisine ? (
                  <span className="error">{formik.errors.foodCuisine}</span>
                ) : null}
              </span>
            </div>
            <input
              className="add-Food-Category-Input"
              placeholder={"Cuisine: " + category?.foodCuisine}
              {...formik.getFieldProps("foodCuisine")}
            />
          </div>
          <button className="add-food-category-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
