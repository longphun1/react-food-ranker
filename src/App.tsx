import { Fragment, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./routes/login/login";
import Home from "./routes/home/home";
import PrivateRoutes from "./routes/PrivateRoutes";
import { useDispatch } from "react-redux";
import { login } from "./store/user/user.store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase/firebase.utils";

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
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Fragment>
  );
};

export default App;
