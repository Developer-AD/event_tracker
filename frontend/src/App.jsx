import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getEvents } from "./services/api";


const itemsPerPage = 6;

function App() {
  const [eventLogs, setEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEventLogs = async (
    query = "dstaddr=30.55.177.194",
    start_time = null,
    end_time = null
  ) => {
    try {
      // alert("Fetch event log.");

      const res = await getEvents(query, start_time, end_time);
      // console.log(res);
      if (res.data.success){
        // alert('Success.');
        setEventLogs(res.data.data);

        console.log(res.data.data)
      }
    } catch (error) {
      // toast.error("Failed to fetch event logs.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEventLogs();
  }, []);


  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="search-section">
          <h2>Event Search</h2>
          <div className="search-container">
            <div className="search-group">
              <label>Custom Search</label>
              <input
                type="text"
                placeholder="Search IP or (e.g. dstaddr=221.181.27.227)"
                value=""
              />
            </div>
            <div className="search-group">
              <label>Start Time</label>
              <input
                type="text"
                placeholder="Start Time (epoch)"
              />
            </div>
            <div className="search-group">
              <label>End Time</label>
              <input
                type="text"
                placeholder="End Time (epoch)"
              />
            </div>

            <button
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Searching...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : eventLogs.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="cards-container">
              {eventLogs.map((item, index) => (
                <Card key={index} item={item} />
              ))}
            </div>

            {/* <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              currentPage={currentPage}
              paginate={paginate}
            /> */}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Header Component

// Card Component
const Card = ({ item }) => (
  <div className="result-card">
    <div className="event-header">
      Event Found: {item.srcaddr} → {item.dstaddr}
    </div>
    <p>
      <strong>Action:</strong>
      <span className={`action-badge action-${item.action.toLowerCase()}`}>
        {item.action}
      </span>
    </p>
    <p>
      <strong>Log Status:</strong>
      <span className={`status-badge status-${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    </p>
    <p>
      <strong>File:</strong>
      <span>{item.filename}</span>
    </p>
    <p>
      <strong>Search Time:</strong>
      <span>{item.duration}</span>
    </p>
  </div>
);

export default App;
