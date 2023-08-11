import * as yup from "yup";

export const FoodPlaceValSchema = yup.object().shape({
  foodPlace: yup.string().required("Place required"),
  foodLocation: yup.string().required("Location required"),
  foodRating: yup
    .number()
    .required("Rating required")
    .min(1, "Must be at least 1")
    .max(10, "Must be less than 10")
    .positive("Must be a positive number"),
});
