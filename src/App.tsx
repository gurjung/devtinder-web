import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRoutes from "@/app/routes";
import "./App.css";

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter basename="/">
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
