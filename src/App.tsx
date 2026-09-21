import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppRoutes from "@/app/routes";
import "./App.css";

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
