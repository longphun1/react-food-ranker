import "./view-all-categories.styles.scss";
import { useState, useEffect, Fragment } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FoodCategory } from "../../components/shared-types";
import { db } from "../../utils/firebase/firebase.utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

const ViewCategories = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  const uid = useSelector((state: RootState) => state.userReducer.user!.uid);

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

  const deleteCategory = async (id: string) => {
    const categoryRef = doc(db, `userFoodCategory/${uid}/foods`, id);
    await deleteDoc(categoryRef);
    window.location.reload();
  };

  return (
    <div className="view-categories-container">
      <div className="view-categories-sub-container">
        <h1 className="categories-title">View All Categories</h1>
        {categories.map((category) => {
          return (
            <div className="category-container">
              <h3 className="foodName">
                {category.foodName}{" "}
                <span className="cuisine">{category.foodCuisine}</span>
              </h3>
              <button
                className="delete-category-btn"
                onClick={() => {
                  deleteCategory(category.id);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCategories;
