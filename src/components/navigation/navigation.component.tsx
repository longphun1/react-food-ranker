import { useNavigate, Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment, useState } from "react";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import { login } from "../../store/user/user.store";
import "./navigation.styles.scss";

const Navigation = () => {
  const [toggleOn, setToggleOn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggle = () => setToggleOn(!toggleOn);

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
          <button className="add-nav-links" onClick={goToAddFood}>
            Add Food
          </button>

          <div className="user-nav-container" id={toggleOn ? "showLinks" : ""}>
            <div className="user-img" onClick={handleToggle} />
            <span className="point-up-triangle">&#9650;</span>
            <div className="links-dropdown-menu">
              <button className="nav-links" onClick={goToViewAll}>
                View All
              </button>
              <button className="nav-links" onClick={handlerSignOut}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
