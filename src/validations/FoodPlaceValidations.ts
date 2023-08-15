import * as yup from "yup";

export const FoodPlaceValSchema = yup.object().shape({
  foodPlace: yup.string().required("Place required"),
  foodPlaceItemName: yup.string().required("Item name required"),
  foodPlaceItemPrice: yup
    .number()
    .required("Price required")
    .positive("Must be a positive number")
    .test("decimal-places", "Maximum 2 decimal places allowed", (value) => {
      if (value === undefined) return true;
      return /^(\d+(\.\d{1,2})?)$/.test(value.toString());
    }),
  foodAddress: yup.string().required("Address required"),
  foodRating: yup
    .number()
    .integer("Must be a whole number")
    .required("Rating required")
    .max(10, "Must be less than 10")
    .positive("Must be a positive number"),
});
