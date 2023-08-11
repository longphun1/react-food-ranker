import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import { login } from "../../store/user/user.store";
import "./sign-in-form.styles.scss";

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup(); // store the getAuth() info from google provider into user
    createUserDocumentFromAuth(user); // create user from the google login method and store user in firebase
    navigate("/");
  };

  return (
    <div className="sign-in-container">
      <Button
        type="button"
        buttonType={BUTTON_TYPE_CLASSES.google}
        onClick={signInWithGoogle}
      >
        Google sign In
      </Button>
    </div>
  );
};

export default SignInForm;
