import { Fragment, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./routes/login/login";
import Home from "./routes/home/home";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch } from "react-redux";
import { login } from "./store/user/user.store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase/firebase.utils";
import AddFoodCategory from "./routes/add-food-category/add-food-category";
import Navigation from "./components/navigation/navigation.component";
import AddFood from "./routes/add-food/add-food";
import ViewFoodPlace from "./routes/view-food-place/view-food-place";
import ViewCategory from "./routes/view-category/view-category";
import UpdateFoodPlace from "./routes/update-food-place/update-food-place";
import ViewCategories from "./routes/view-all-categories/view-all-categories";
import UpdateCategory from "./routes/update-category/update-category";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            email: userAuth.email,
          })
        );
      } else {
        console.log("error with login redux");
      }
    });
  });

  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Navigation />}>
            <Route index element={<Home />} />
            <Route path="/FoodCategory/add" element={<AddFoodCategory />} />
            <Route path="/add/:foodName/:id" element={<AddFood />} />
            <Route
              path="/view/:foodCategoryID/:foodPlace/:id"
              element={<ViewFoodPlace />}
            />
            <Route
              path="/update/:foodName/:foodCategoryID/:foodPlace/:id"
              element={<UpdateFoodPlace />}
            />
            <Route path="/view/:foodName/:id/all" element={<ViewCategory />} />
            <Route path="/view/categories/all" element={<ViewCategories />} />
            <Route path="/update/:foodName/:id" element={<UpdateCategory />} />
          </Route>
        </Route>
      </Routes>
    </Fragment>
  );
};

export default App;
