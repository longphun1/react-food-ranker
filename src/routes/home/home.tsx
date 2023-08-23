import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { RootState } from "../../store/rootReducer";
import FoodCategoryCard from "../../components/food-category-card/food-category-card.component";
import "./home.styles.scss";
import Pagination from "../../components/pagination/pagination.component";
import SearchBox from "../../components/search-box/search-box.component";

type FoodCategory = {
  id: string;
  foodName: string;
};

const Home = () => {
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
  const [searchField, setSearchField] = useState("");
  const [filteredCategories, setFilterCategories] = useState(foodCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(8);

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const foodCategoriesRef = collection(db, `userFoodCategory/${uid}/foods`);

  useEffect(() => {
    const getFoodCategories = async () => {
      const data = await getDocs(foodCategoriesRef);
      setFoodCategories(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodName: doc.data().foodName,
        }))
      );
    };

    getFoodCategories();
  }, []);

  useEffect(() => {
    const newFilteredCategories = foodCategories.filter((food) => {
      return food.foodName.toLocaleLowerCase().includes(searchField);
    });

    setFilterCategories(newFilteredCategories);
  }, [foodCategories, searchField]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
    setSearchField(searchFieldString);
  };

  const lastPostIndex = currentPage * postsPerPage;
  const firePostIndex = lastPostIndex - postsPerPage;
  const currentCategories = filteredCategories.slice(
    firePostIndex,
    lastPostIndex
  );

  return (
    <Fragment>
      <div className="search-box-container">
        <SearchBox
          className="weeklies-search-box"
          onChangeHandler={onSearchChange}
          placeholder="Search Categories"
        />
      </div>
      <div className="home-container">
        <div className="food-categories-container">
          {currentCategories.map((food) => {
            return (
              <div key={food.id} className="something">
                <FoodCategoryCard foodItem={food} />
              </div>
            );
          })}
        </div>
        <Pagination
          totalPosts={filteredCategories.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </Fragment>
  );
};

export default Home;
