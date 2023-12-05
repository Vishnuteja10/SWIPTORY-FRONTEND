import { useContext } from "react";
import StoryContext from "../context/useContext";

const useStoryContext = () => {
  return useContext(StoryContext);
};

export default useStoryContext;
