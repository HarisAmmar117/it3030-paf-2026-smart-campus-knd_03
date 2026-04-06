import { useState } from "react";
import "./App.css";
import TicketCreatePage from "./pages/ticket/TicketCreatePage";
import TicketListPage from "./pages/ticket/TicketListPage";

function App() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActiveTab("create")}
          className={activeTab === "create" ? "btn-primary" : "btn-secondary"}
        >
          Create Ticket
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={activeTab === "list" ? "btn-primary" : "btn-secondary"}
        >
          View Tickets
        </button>
      </div>

      {activeTab === "create" ? <TicketCreatePage /> : <TicketListPage />}
    </div>
  );
}

export default App;