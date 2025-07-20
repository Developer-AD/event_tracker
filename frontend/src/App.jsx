import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Mock data for events
const mockData = [
  {
    id: 1,
    srcaddr: "192.168.1.100",
    dstaddr: "10.0.0.50",
    action: "ALLOW",
    logStatus: "SUCCESS",
    file: "/var/log/firewall.log",
    searchTime: "2023-12-01 14:30:25",
  },
  {
    id: 2,
    srcaddr: "172.16.0.15",
    dstaddr: "8.8.8.8",
    action: "BLOCK",
    logStatus: "FAILED",
    file: "/var/log/security.log",
    searchTime: "2023-12-01 14:28:10",
  },
  {
    id: 3,
    srcaddr: "10.0.0.25",
    dstaddr: "192.168.1.1",
    action: "ALLOW",
    logStatus: "SUCCESS",
    file: "/var/log/network.log",
    searchTime: "2023-12-01 14:25:45",
  },
  {
    id: 4,
    srcaddr: "203.0.113.10",
    dstaddr: "172.16.0.100",
    action: "BLOCK",
    logStatus: "SUCCESS",
    file: "/var/log/firewall.log",
    searchTime: "2023-12-01 14:22:30",
  },
  {
    id: 5,
    srcaddr: "192.168.1.50",
    dstaddr: "10.0.0.75",
    action: "ALLOW",
    logStatus: "SUCCESS",
    file: "/var/log/security.log",
    searchTime: "2023-12-01 14:20:15",
  },
  {
    id: 6,
    srcaddr: "172.16.0.200",
    dstaddr: "8.8.4.4",
    action: "BLOCK",
    logStatus: "FAILED",
    file: "/var/log/network.log",
    searchTime: "2023-12-01 14:18:00",
  },
  {
    id: 7,
    srcaddr: "10.0.0.30",
    dstaddr: "192.168.1.10",
    action: "ALLOW",
    logStatus: "SUCCESS",
    file: "/var/log/firewall.log",
    searchTime: "2023-12-01 14:15:30",
  },
  {
    id: 8,
    srcaddr: "203.0.113.25",
    dstaddr: "172.16.0.150",
    action: "BLOCK",
    logStatus: "SUCCESS",
    file: "/var/log/security.log",
    searchTime: "2023-12-01 14:12:45",
  },
  {
    id: 9,
    srcaddr: "192.168.1.75",
    dstaddr: "10.0.0.25",
    action: "ALLOW",
    logStatus: "SUCCESS",
    file: "/var/log/network.log",
    searchTime: "2023-12-01 14:10:20",
  },
  {
    id: 10,
    srcaddr: "172.16.0.125",
    dstaddr: "1.1.1.1",
    action: "BLOCK",
    logStatus: "FAILED",
    file: "/var/log/firewall.log",
    searchTime: "2023-12-01 14:08:05",
  },
];

const itemsPerPage = 6;

function App() {
  const [searchTerm, setSearchTerm] = useState({
    field1: "",
    field2: "",
    field3: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(mockData);
  const [currentItems, setCurrentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search input changes
  const handleInputChange = (e, field) => {
    setSearchTerm({ ...searchTerm, [field]: e.target.value });
  };

  // Filter data based on search terms
  const handleSearch = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const filtered = mockData.filter(
      (item) =>
        item.srcaddr.toLowerCase().includes(searchTerm.field1.toLowerCase()) &&
        item.dstaddr.toLowerCase().includes(searchTerm.field2.toLowerCase()) &&
        item.action.toLowerCase().includes(searchTerm.field3.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Update current page items when filtered data or page changes
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredData]);

  // Handle pagination click
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const totalEvents = filteredData.length;
  const allowedEvents = filteredData.filter(
    (item) => item.action === "ALLOW"
  ).length;
  const blockedEvents = filteredData.filter(
    (item) => item.action === "BLOCK"
  ).length;
  const successEvents = filteredData.filter(
    (item) => item.logStatus === "SUCCESS"
  ).length;

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
                value={searchTerm.field1}
                onChange={(e) => handleInputChange(e, "field1")}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="search-group">
              <label>Start Time</label>
              <input
                type="text"
                placeholder="Start Time (epoch)"
                value={searchTerm.field2}
                onChange={(e) => handleInputChange(e, "field2")}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="search-group">
              <label>End Time</label>
              <input
                type="text"
                placeholder="End Time (epoch)"
                value={searchTerm.field2}
                onChange={(e) => handleInputChange(e, "field2")}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              className="search-button"
              onClick={handleSearch}
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
        ) : currentItems.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="cards-container">
              {currentItems.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>

            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              currentPage={currentPage}
              paginate={paginate}
            />
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
      <span className={`status-badge status-${item.logStatus.toLowerCase()}`}>
        {item.logStatus}
      </span>
    </p>
    <p>
      <strong>File:</strong>
      <span>{item.file}</span>
    </p>
    <p>
      <strong>Search Time:</strong>
      <span>{item.searchTime}</span>
    </p>
  </div>
);

// Pagination Component
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() =>
          paginate(currentPage < totalPages ? currentPage + 1 : totalPages)
        }
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </div>
  );
};

export default App;