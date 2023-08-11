import * as yup from "yup";

export const FoodCategoryValSchema = yup.object().shape({
  foodName: yup.string().required("Name Required"),
  foodCuisine: yup.string().required("Cuisine Required"),
});
