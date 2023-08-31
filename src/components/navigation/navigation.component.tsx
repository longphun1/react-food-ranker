import { useNavigate, Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment } from "react";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import { login } from "../../store/user/user.store";
import "./navigation.styles.scss";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSignOut = async () => {
    await signOutUser();
    dispatch(login({ user: null }));
  };

  const goToAddFood = () => {
    navigate("/FoodCategory/add");
  };

  const goToViewAll = () => {
    navigate("/view/categories/all");
  };

  return (
    <Fragment>
      <div className="navigation-container">
        <Link to="/" className="logo-container">
          <img
            className="logo"
            src="https://i.imgur.com/0e8nvEL.png"
            alt="logo"
          />
          <img
            className="logo1"
            src="https://i.imgur.com/aIz2uJE.png"
            alt="logo"
          />
        </Link>
        <div className="nav-links-container">
          <button className="nav-links" onClick={goToAddFood}>
            Add Food
          </button>
          <button className="nav-links" onClick={goToViewAll}>
            View All
          </button>
          <button className="nav-links" onClick={handlerSignOut}>
            sign out
          </button>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
