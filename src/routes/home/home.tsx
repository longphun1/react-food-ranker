import { signOutUser } from "../../utils/firebase/firebase.utils";
import { useSelector, useDispatch } from "react-redux";
import { homemade, eatout } from "../../store/dinnerPlan.store";
import { login } from "../../store/user/user.store";
import { RootState } from "../../store/rootReducer";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userReducer.user)!;
  const dinnerPlan = useSelector(
    (state: RootState) => state.dinnerReducer.value
  );

  const handlerSignOut = async () => {
    await signOutUser();
    dispatch(login({ user: null }));
  };

  return (
    <div>
      <h2>home page {user.email}</h2>
      <h1>Dinner plan: {dinnerPlan}</h1>
      <button onClick={() => dispatch(homemade())}>Home</button>
      <button onClick={() => dispatch(eatout())}>Resturant</button>
      <button onClick={handlerSignOut}>sign out</button>
    </div>
  );
};

export default Home;
