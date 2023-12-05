import { createContext, useState } from "react";

const StoryContext = createContext();

const Provider = ({ children }) => {
  const [category, setCategory] = useState();
  const [addStory, setAddStory] = useState(false);
  const [isEditStory, setIsEditStory] = useState(false);
  const [login, setLogin] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState({});
  const [stories, setStories] = useState([]);
  const [story, setStory] = useState([{}]);
  const [viewStory, setViewStory] = useState(false);
  const [storyId, setStoryId] = useState();
  const [likestory, setLikeStory] = useState(false);
  const [likeCount, setLikeCount] = useState();
  const [showYourStories, setShowYourStories] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [bookmark, setbookmark] = useState(false);

  const data = {
    category,
    setCategory,
    addStory,
    setAddStory,
    login,
    setLogin,
    openLogin,
    setOpenLogin,
    openRegister,
    setOpenRegister,
    user,
    setUser,
    story,
    setStory,
    viewStory,
    setViewStory,
    stories,
    setStories,
    isEditStory,
    setIsEditStory,
    storyId,
    setStoryId,
    likestory,
    setLikeStory,
    likeCount,
    setLikeCount,
    showYourStories,
    setShowYourStories,
    showBookmarks,
    setShowBookmarks,
    selectedItem,
    setSelectedItem,
    bookmark,
    setbookmark,
    token,
    setToken,
    userId,
    setUserId,
  };

  return <StoryContext.Provider value={data}>{children}</StoryContext.Provider>;
};

export { Provider };

export default StoryContext;
