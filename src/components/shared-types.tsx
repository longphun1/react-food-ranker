export type FoodCategoryCardProps = {
  foodItem: FoodCategoryCard;
};

export type FoodCategoryCard = {
  id: string;
  foodName: string;
};

export type FoodPlaces = {
  id: string;
  foodPlace: string;
  foodLocation?: string;
  foodRating?: number;
  foodNote?: string;
};

export type FoodPlaceProps = {
  food: FoodPlaces;
  foodCategoryID: string;
};
