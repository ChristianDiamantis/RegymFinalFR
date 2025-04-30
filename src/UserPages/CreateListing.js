import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../styles/UserPages.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const CreateListing = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (name === "price") {
      const priceVal = parseFloat(value);
      if (priceVal > 10000 || (priceVal < 1 && value !== "")) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.condition ||
      !form.category
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (form.title.length > 20) {
      alert("Title too long. Max 20 characters.");
      return;
    }

    if (form.description.length > 30) {
      alert("Description too long. Max 30 characters.");
      return;
    }

    const price = parseFloat(form.price);
    if (isNaN(price) || price < 1 || price > 10000) {
      alert("Price must be between $1 and $10,000.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to create a listing.");
      return;
    }


    // I used this try block to handle uploading a listing with an image. 
    // If an image is selected, I convert it to a Base64 string using FileReader 
    // before sending it along with the rest of the listing data to the backend in a POST request. 
    // This ensures the image is properly encoded for database storage or API processing.
    try {
      let imageBase64 = null;

      if (form.image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageBase64 = reader.result;

          const response = await fetch(`${API_BASE_URL}/api/listings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              title: form.title,
              description: form.description,
              price: form.price,
              condition: form.condition,
              category: form.category,
              image: imageBase64,
            }),
          });

          if (response.ok) {
            alert("Listing submitted!");
            setForm({
              title: "",
              description: "",
              price: "",
              condition: "",
              category: "",
              image: null,
            });
            setPreview(null);
            navigate("/my-listings");
          } else {
            alert("Failed to submit listing.");
          }
        };
        reader.readAsDataURL(form.image);
      } else {
        const response = await fetch(`${API_BASE_URL}/api/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            title: form.title,
            description: form.description,
            price: form.price,
            condition: form.condition,
            category: form.category,
            image: null,
          }),
        });

        if (response.ok) {
          alert("Listing submitted!");
          setForm({
            title: "",
            description: "",
            price: "",
            condition: "",
            category: "",
            image: null,
          });
          setPreview(null);
          navigate("/my-listings");
        } else {
          alert("Failed to submit listing.");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred while submitting the listing.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="create-listing-wrapper">
        <h2>Create New Listing</h2>
        <form className="create-listing-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Item Title (max 20 characters)"
            value={form.title}
            onChange={handleChange}
            maxLength={20}
            required
          />
          <small>{form.title.length}/20 characters</small>

          <textarea
            name="description"
            placeholder="Item Description (max 30 characters)"
            value={form.description}
            onChange={handleChange}
            rows={5}
            maxLength={30}
            required
          />
          <small>{form.description.length}/30 characters</small>

          <input
            type="number"
            name="price"
            placeholder="Price (USD)"
            value={form.price}
            onChange={handleChange}
            min={1}
            max={10000}
            required
          />
          <small>Price must be between $1 and $10,000</small>

          <select name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="used">Used</option>
          </select>

          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="weights">Weights</option>
            <option value="machines">Machines</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <button type="submit">Submit Listing</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateListing;
