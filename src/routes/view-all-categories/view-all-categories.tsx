import "./view-all-categories.styles.scss";
import { useState, useEffect, Fragment } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FoodCategoryType } from "../../components/shared-types";
import { db } from "../../utils/firebase/firebase.utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import Pagination from "../../components/pagination/pagination.component";
import SearchBox from "../../components/search-box/search-box.component";

const ViewCategories = () => {
  const [categories, setCategories] = useState<FoodCategoryType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(5);
  const [searchField, setSearchField] = useState("");
  const [filteredCategories, setFilterCategories] = useState(categories);
  const [optionFilter, setOptionFilter] = useState("alphabetical");
  const [toggleStates, setToggleStates] = useState<boolean[]>(
    Array(categories.length).fill(false)
  );

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

  const navigate = useNavigate();

  const categoriesRef = collection(db, `userFoodCategory/${uid}/foods`);

  useEffect(() => {
    const getCategories = async () => {
      const data = await getDocs(categoriesRef);
      setCategories(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodName: doc.data().foodName,
          foodCuisine: doc.data().foodCuisine,
        }))
      );
    };

    getCategories();
  }, []);

  useEffect(() => {
    const newFilteredCategories = categories.filter((food) => {
      return food.foodName.toLocaleLowerCase().includes(searchField);
    });

    setFilterCategories(newFilteredCategories);
  }, [categories, searchField]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
    setSearchField(searchFieldString);
  };

  const applyFiltersAndSort = (optionValue: string) => {
    let filteredAndSortedCategories = [...categories];

    if (searchField) {
      filteredAndSortedCategories = filteredAndSortedCategories.filter(
        (category) =>
          category.foodName.toLocaleLowerCase().includes(searchField)
      );
    }

    switch (optionValue) {
      case "alphabetical":
        return filteredAndSortedCategories.sort((a, b) =>
          a.foodName.localeCompare(b.foodName)
        );
      case "cuisine":
        return filteredAndSortedCategories.sort((a, b) =>
          a.foodCuisine.localeCompare(b.foodCuisine)
        );

      default:
        return filteredAndSortedCategories;
    }
  };

  const handleOptions = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const optionValue = event.target.value;
    setOptionFilter(optionValue);
    const filteredAndSortedPlaces = applyFiltersAndSort(optionValue);
    setFilterCategories(filteredAndSortedPlaces);
  };

  useEffect(() => {
    const newFilteredCategories = applyFiltersAndSort(optionFilter);
    setFilterCategories(newFilteredCategories);
  }, [categories, searchField]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentCategories = filteredCategories.slice(
    firstPostIndex,
    lastPostIndex
  );

  const toggleKabobMenu = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  const deleteCategory = async (id: string) => {
    const categoryRef = doc(db, `userFoodCategory/${uid}/foods`, id);
    await deleteDoc(categoryRef);
    window.location.reload();
  };

  const goBackHandler = () => {
    navigate("/home");
  };

  const goToViewCategory = (foodName: string, id: string) => {
    navigate(`/view/${foodName}/${id}/all`);
  };

  const goToUpdateCategory = (foodName: string, id: string) => {
    navigate(`/update/${foodName}/${id}`);
  };

  const goToAdd = () => navigate("/FoodCategory/add");

  return (
    <div className="view-categories-container">
      <div className="go-back-btn-container">
        <span className="go-back-btn" onClick={goBackHandler}>
          &#8617;
        </span>
      </div>
      <div className="search-box-container">
        <SearchBox
          className="search-box"
          onChangeHandler={onSearchChange}
          placeholder="Search Places"
        />
        <div className="option-sort-container">
          <select className="option-sort" onChange={handleOptions}>
            <option className="option" value="alphabetical">
              A - Z
            </option>
            <option className="option" value="cuisine">
              Cuisine
            </option>
          </select>
        </div>
      </div>
      <div className="view-categories-sub-container">
        <div className="all-categories-box">
          <span className="view-all-cats-title">Viewing All Categories</span>
          {currentCategories.length ? (
            <Fragment>
              {currentCategories.map((category, index) => {
                return (
                  <div className="category-container" key={category.id}>
                    <h2
                      className="foodName"
                      onClick={() => {
                        goToViewCategory(category.foodName, category.id);
                      }}
                    >
                      {category.foodName}{" "}
                      <span className="cuisine">({category.foodCuisine})</span>
                    </h2>
                    <div className="menu-btn-container">
                      <div
                        className="btns-container"
                        id={toggleStates[index] ? "hidden" : ""}
                      >
                        <button
                          className="category-btns"
                          onClick={() =>
                            goToUpdateCategory(category.foodName, category.id)
                          }
                        >
                          Update
                        </button>
                        <button
                          className="category-btns"
                          id="delete"
                          onClick={() => {
                            deleteCategory(category.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <span
                        className="kabob-menu"
                        onClick={() => toggleKabobMenu(index)}
                      >
                        &#10247;
                      </span>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ) : (
            <div>
              <p className="no-collection">You have no categories</p>
              <button className="go-to-add-btn" onClick={goToAdd}>
                Add Food
              </button>
            </div>
          )}
        </div>
        {currentCategories.length ? (
          <Pagination
            totalPosts={categories.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ViewCategories;
