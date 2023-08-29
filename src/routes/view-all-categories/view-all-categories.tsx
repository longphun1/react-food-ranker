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
    <div>
      {categories.map((category) => {
        return (
          <div>
            <h3>{category.foodName}</h3>
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
  );
};

export default ViewCategories;
