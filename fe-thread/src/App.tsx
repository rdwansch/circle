import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Threads from "./pages/Threads";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DetailThread from "./pages/DetailThread";
import Home from "./pages/Home";
import Follows from "./pages/Follows";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import DetailProfile from "./pages/DetailProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/threads" element={<Threads />} />
          <Route path="/threads/:id" element={<DetailThread />} />
          <Route path="/search" element={<Search />} />
          <Route path="/follows" element={<Follows />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<DetailProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
