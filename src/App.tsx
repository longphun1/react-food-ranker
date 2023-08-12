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
            <Route path="/addFoodCategory" element={<AddFoodCategory />} />
            <Route path="/add/:foodName/:id" element={<AddFood />} />
            <Route
              path="/view/:foodCategoryID/:foodPlace/:id"
              element={<ViewFoodPlace />}
            />
          </Route>
        </Route>
      </Routes>
    </Fragment>
  );
};

export default App;
