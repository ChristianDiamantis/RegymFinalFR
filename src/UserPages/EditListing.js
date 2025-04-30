import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/UserPages.css";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch listing");
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          condition: data.condition || "",
          category: data.category || "",
          image: data.image || "",
        });
        if (data.image) setPreview(data.image);
      })
      .catch((error) => {
        console.error("Error loading listing:", error);
        alert("Unable to load listing. Please try again later.");
      });
  }, [id]);

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

    let imageBase64 = preview;
    if (form.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;
        await updateListing(imageBase64);
      };
      reader.readAsDataURL(form.image);
    } else {
      await updateListing(imageBase64);
    }
  };

  const updateListing = async (image) => {
    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: form.price,
        condition: form.condition,
        category: form.category,
        image,
      }),
    });

    if (response.ok) {
      alert("Listing updated!");
      navigate("/my-listings");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="create-listing-wrapper">
        <h2>Edit Listing</h2>
        <form className="create-listing-form" onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Item Title (max 20 characters)"
            maxLength={20}
            required
          />
          <small>{form.title.length}/20 characters</small>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            maxLength={30}
            placeholder="Item Description (max 30 characters)"
            required
          />
          <small>{form.description.length}/30 characters</small>

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            min={1}
            max={10000}
            required
          />
          <small>Price must be between $1 and $10,000</small>

          <select name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Category</option>
            <option value="weights">Weights</option>
            <option value="machines">Machines</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
          </select>

          <input type="file" onChange={handleImageUpload} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <button type="submit">Update Listing</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditListing;
