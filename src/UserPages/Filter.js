import React, { useState } from "react";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import "../styles/UserPages.css"; 
import API_BASE_URL from "../config"; 

// Functional component to filter listings based on user input
const Filter = () => {
  // State to store filter criteria
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    location: "",
  });

  // State to store filtered results
  const [results, setResults] = useState([]);

  // Handler function to update filter criteria state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handler function to reset filter criteria and results
  const handleReset = () => {
    setFilters({
      keyword: "",
      category: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      location: "",
    });
    setResults([]);
  };

  // Handler function to apply filters and fetch filtered results
  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Filter error:", err);
      alert("Failed to apply filters.");
    }
  };


  return (
    <div>
      <Navbar />
      <main className="filter-wrapper">
        <h2>Filter Listings</h2>
        <form className="filter-form" onSubmit={handleApply}>
          <input
            type="text"
            name="keyword"
            placeholder="Search by keyword..."
            value={filters.keyword}
            onChange={handleChange}
          />

          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">Category</option>
            <option value="weights">Weights</option>
            <option value="machines">Machines</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>

          <select name="condition" value={filters.condition} onChange={handleChange}>
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="used">Used</option>
          </select>

          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
          />

          <div className="filter-buttons">
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset Filters
            </button>
            <button type="submit" className="apply-btn">
              Apply Filters
            </button>
          </div>
        </form>

        {/* Results Section */}
        <div className="filtered-results">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className="item-card">
                <div className="image-placeholder">
                  {item.image ? <img src={item.image} alt={item.title} /> : "No Image"}
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Price:</strong> ${item.price}</p>
              </div>
            ))
          ) : (
            <p>No results to display.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default Filter;