import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import ChatRoom from "./pages/Chat.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className="wrapper">
        <div className="app-container">
          <div className="app-container__content">
              <ChatRoom />
          </div>
        </div>
      </div>
    </Provider>
  </React.StrictMode>
);
