import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { RootState } from "../../store/rootReducer";
import FoodCategoryCard from "../../components/food-category-card/food-category-card.component";
import "./home.styles.scss";
import Pagination from "../../components/pagination/pagination.component";
import SearchBox from "../../components/search-box/search-box.component";
import { FoodCategoryType } from "../../components/shared-types";

const Home = () => {
  const [foodCategories, setFoodCategories] = useState<FoodCategoryType[]>([]);
  const [searchField, setSearchField] = useState("");
  const [filteredCategories, setFilterCategories] = useState(foodCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(8);

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const foodCategoriesRef = collection(db, `userFoodCategory/${uid}/foods`);

  const sortCategoriesByAlphabet = [...filteredCategories].sort((a, b) =>
    a.foodName.localeCompare(b.foodName)
  );

  useEffect(() => {
    const getFoodCategories = async () => {
      const data = await getDocs(foodCategoriesRef);
      setFoodCategories(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodName: doc.data().foodName,
          foodCuisine: doc.data().foodCuisine,
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
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentCategories = sortCategoriesByAlphabet.slice(
    firstPostIndex,
    lastPostIndex
  );

  return (
    <Fragment>
      {currentCategories.length ? (
        <Fragment>
          <div className="search-box-container">
            <SearchBox
              className="search-box"
              id="home"
              onChangeHandler={onSearchChange}
              placeholder="Search Categories"
            />
          </div>
          <div className="home-container">
            <div className="food-categories-container">
              {currentCategories.map((food) => {
                return (
                  <div key={food.id} className="category-card">
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
          </div>{" "}
        </Fragment>
      ) : (
        <div className="home-container" id="no-collection">
          <div>
            <div className="no-categories-img" />
            <h3 className="no-categories-text">No Food Collection</h3>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
