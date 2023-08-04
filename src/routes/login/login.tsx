import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import "./login.styles.scss";

const Login = () => {
  return (
    <div>
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

export default Login;
