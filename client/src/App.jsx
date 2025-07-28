
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ToastProvider from "./components/ToastProvider";

function App() {
  return (
    <Router>
      <AppRoutes />
      <ToastProvider />
    </Router>
  );
}

export default App;
