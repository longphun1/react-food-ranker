import "./view-category.styles.scss";
import { useParams, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { FoodPlaces } from "../../components/shared-types";
import ViewCategoryPlace from "../../components/view-category-place/view-category-place.component";
import Pagination from "../../components/pagination/pagination.component";
import SearchBox from "../../components/search-box/search-box.component";

const ViewCategory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(5);
  const [foodPlaces, setFoodPlaces] = useState<FoodPlaces[]>([]);
  const [searchField, setSearchField] = useState("");
  const [filteredPlaces, setFilterPlaces] = useState(foodPlaces);
  const [optionFilter, setOptionFilter] = useState("top-rated");

  const { id } = useParams();
  const { foodName } = useParams();

  const navigate = useNavigate();

  const foodPlacesRef = collection(db, `foodCategory/${id}/places`);

  useEffect(() => {
    const getFoodPlaces = async () => {
      const data = await getDocs(foodPlacesRef);
      setFoodPlaces(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          foodPlace: doc.data().foodPlace,
          foodPlaceItemName: doc.data().foodPlaceItemName,
          foodPlaceItemPrice: doc.data().foodPlaceItemPrice,
          foodRating: doc.data().foodRating,
          foodAddress: doc.data().foodAddress,
          foodNote: doc.data().foodNote,
        }))
      );
    };

    getFoodPlaces();
  }, []);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
    setSearchField(searchFieldString);
  };

  const applyFiltersAndSort = (optionValue: string) => {
    let filteredAndSortedPlaces = [...foodPlaces];

    if (searchField) {
      filteredAndSortedPlaces = filteredAndSortedPlaces.filter((food) =>
        food.foodPlace.toLocaleLowerCase().includes(searchField)
      );
    }

    switch (optionValue) {
      case "top-rated":
        return filteredAndSortedPlaces.sort(
          (a, b) => b.foodRating - a.foodRating
        );
      case "alphabetical":
        return filteredAndSortedPlaces.sort((a, b) =>
          a.foodPlace.localeCompare(b.foodPlace)
        );
      case "price":
        return filteredAndSortedPlaces.sort(
          (a, b) => b.foodPlaceItemPrice - a.foodPlaceItemPrice
        );
      case "recommendation":
        return filteredAndSortedPlaces.sort(
          (a, b) => b.foodRecommendationCount! - a.foodRecommendationCount!
        );
      default:
        return filteredAndSortedPlaces;
    }
  };

  const handleOptions = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const optionValue = event.target.value;
    setOptionFilter(optionValue);
    const filteredAndSortedPlaces = applyFiltersAndSort(optionValue);
    setFilterPlaces(filteredAndSortedPlaces);
  };

  useEffect(() => {
    const newFilteredPlaces = applyFiltersAndSort(optionFilter);
    setFilterPlaces(newFilteredPlaces);
  }, [foodPlaces, searchField]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPlaces = filteredPlaces.slice(firstPostIndex, lastPostIndex);

  const goBackHandler = () => {
    navigate("/");
  };

  const goToAdd = () => {
    navigate(`/add/${foodName}/${id}`);
  };

  return (
    <div className="view-category-container">
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
            <option className="option" value="top-rated">
              Top Rated
            </option>
            <option className="option" value="alphabetical">
              A - Z
            </option>
            <option className="option" value="price">
              Price
            </option>
            <option className="option" value="recommendation">
              Recommended
            </option>
          </select>
        </div>
      </div>
      <div className="view-category-sub-container">
        <div className="view-category-box">
          <span className="foodName-title">{foodName}</span>
          {currentPlaces.length ? (
            <Fragment>
              {currentPlaces.map((food) => {
                return (
                  <div className="view-category-place" key={food.id}>
                    <ViewCategoryPlace
                      food={food}
                      foodCategoryID={id}
                      foodName={foodName}
                    />
                  </div>
                );
              })}
            </Fragment>
          ) : (
            <div>
              <p className="no-collection">You have no collection</p>
              <button className="go-to-add-btn" onClick={goToAdd}>
                ADD
              </button>
            </div>
          )}
        </div>

        {currentPlaces.length ? (
          <Pagination
            totalPosts={filteredPlaces.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ViewCategory;
