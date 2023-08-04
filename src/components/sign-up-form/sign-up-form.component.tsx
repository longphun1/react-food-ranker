import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError, AuthErrorCodes } from "firebase/auth";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
// import Button from "../button/button.component";
import "./sign-up-form.styles.scss";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("password does not match");
      return;
    }

    // try {
    //   const { user } = await createAuthUserWithEmailAndPassword(
    //     email,
    //     password
    //   );
    //   await createUserDocumentFromAuth(user, { displayName });
    //   resetFormFields();
    //   navigate("/");
    // } catch (error) {
    //   if ((error as AuthError).code === AuthErrorCodes.EMAIL_EXISTS) {
    //     alert("Email already in use");
    //   } else {
    //     alert("There was an error in creating the user");
    //   }
    // }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value }); //spread out all the form fields and modify only one field at a time
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Display Name"
          type="text"
          required
          name="displayName"
          onChange={handleChange}
          value={displayName}
        />

        <FormInput
          label="Email"
          type="email"
          required
          name="email"
          onChange={handleChange}
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          name="password"
          onChange={handleChange}
          value={password}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          required
          name="confirmPassword"
          onChange={handleChange}
          value={confirmPassword}
        />

        {/* <Button type="submit">Sign Up</Button> */}
      </form>
    </div>
  );
};

export default SignUpForm;
