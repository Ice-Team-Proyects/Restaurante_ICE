import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
