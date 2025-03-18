
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import BrowseBooks from "@/pages/BrowseBooks";
import PostBook from "@/pages/PostBook";
import Matches from "@/pages/Matches";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/post-book" element={<PostBook />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
