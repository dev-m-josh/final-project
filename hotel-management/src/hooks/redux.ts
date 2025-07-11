// Import the default hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// Import types from Redux and your store setup
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";
// Create a custom hook for dispatching actions
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Create a custom hook for selecting state from the Redux store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
