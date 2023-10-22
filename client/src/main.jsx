import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth.context.jsx";
import { MessageProvider } from "./context/message.context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <MessageProvider>
        <Router>
          <App />
        </Router>
      </MessageProvider>
    </AuthProvider>
  </>
);
