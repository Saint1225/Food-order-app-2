import { Fragment } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import MealsSummary from "./MealsSummary";
import AvailableMeals from "./AvailableMeals";

const queryClient = new QueryClient();

const Meals = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MealsSummary />
      <AvailableMeals />
    </QueryClientProvider>
  );
};

export default Meals;
