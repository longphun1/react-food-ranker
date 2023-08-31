export type FoodCategoryCardProps = {
  foodItem: FoodCategoryType;
};

export type FoodCategoryType = {
  id: string;
  foodName: string;
  foodCuisine: string;
};

export type FoodPlaceType = {
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
  food: FoodPlaceType;
  foodCategoryID: string | undefined;
  foodName?: string;
  foodLength?: number;
  index?: number;
};

export type GoogleGeoCodeResponse = {
  results: {
    place_id: string;
    opening_hours: any;
    geometry: { location: { lat: number; lng: number } };
  }[];
  status: "OK" | "ZERO_RESULTS";
};
