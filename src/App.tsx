import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Body from "./components/body/Body";
import Feed from "./components/feed/Feed";
import Login from "./components/auth/login/Login";
import Profile from "./components/profile/Profile";
import Connections from "./components/connections/Connections";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Requests from "./components/requests/Requests";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
