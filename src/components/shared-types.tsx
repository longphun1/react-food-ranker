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
  foodPlaceItemName?: string;
  foodLocation?: string;
  foodRating?: number;
  foodNote?: string;
  foodRecommendationCount?: number;
};

export type FoodPlaceProps = {
  food: FoodPlaces;
  foodCategoryID: string;
};

export type GoogleGeoCodeResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};
