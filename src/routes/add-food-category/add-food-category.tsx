import { useSelector } from "react-redux";
import { db } from "../../utils/firebase/firebase.utils";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/rootReducer";
import { FoodCategoryValSchema } from "../../validations/FoodCategoryValidations";
import { useFormik } from "formik";
import "./add-food-category.styles.scss";

const AddFoodCategory = () => {
  const navigate = useNavigate();

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const foodCollectionRef = collection(db, `userFoodCategory/${uid}/foods`);

  const formik = useFormik({
    initialValues: {
      foodName: "",
      foodCuisine: "",
    },
    validationSchema: FoodCategoryValSchema,
    onSubmit: async (values) => {
      await addDoc(foodCollectionRef, {
        foodName: values.foodName,
        foodCuisine: values.foodCuisine,
      });
      navigate("/");
    },
  });

  return (
    <div className="add-Food-Category-container">
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            {formik.touched.foodName && formik.errors.foodName ? (
              <div className="error">{formik.errors.foodName}</div>
            ) : null}
            <input
              className="add-Food-Category-Input"
              placeholder="Name"
              {...formik.getFieldProps("foodName")}
            />
          </div>
          <div>
            {formik.touched.foodCuisine && formik.errors.foodCuisine ? (
              <div className="error">{formik.errors.foodCuisine}</div>
            ) : null}
            <input
              className="add-Food-Category-Input"
              placeholder="Cuisine Type"
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

export default AddFoodCategory;
