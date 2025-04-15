import { useContext } from "react";
import { APIProviderContext } from "../APIProvider";

export const useAPI = () => {
  const context = useContext(APIProviderContext);
  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
}