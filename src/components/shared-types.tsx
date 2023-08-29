export type FoodCategoryCardProps = {
  foodItem: FoodCategory;
};

export type FoodCategory = {
  id: string;
  foodName: string;
  foodCuisine?: string;
};

export type FoodPlaces = {
  id: string;
  foodPlace: string;
  foodPlaceItemName: string;
  foodPlaceItemPrice: number;
  foodAddress: string;
  foodRating: number;
  foodNote?: string;
  foodRecommendationCount?: number;
};

export type FoodPlaceProps = {
  food: FoodPlaces;
  foodCategoryID: string | undefined;
  foodName?: string;
};

export type GoogleGeoCodeResponse = {
  results: {
    place_id: string;
    opening_hours: any;
    geometry: { location: { lat: number; lng: number } };
  }[];
  status: "OK" | "ZERO_RESULTS";
};
