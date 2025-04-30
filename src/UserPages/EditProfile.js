import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import "../styles/UserPages.css"; 
import API_BASE_URL from "../config"; 

// Functional component to edit user profile information
const EditProfile = () => {
  // State to store profile form data
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    profileImage: null,
    shipping_address1: "",
    shipping_address2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "USA"
  });

   // State for previewing uploaded profile image
  const [preview, setPreview] = useState(null);
  const userId = sessionStorage.getItem("userId");

  // useEffect hook to load user profile data on component mount
  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            username: data.username || "",
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            location: data.location || "",
            profileImage: data.profileImage || null,
            shipping_address1: data.shipping_address1 || "",
            shipping_address2: data.shipping_address2 || "",
            shipping_city: data.shipping_city || "",
            shipping_state: data.shipping_state || "",
            shipping_zip: data.shipping_zip || "",
            shipping_country: data.shipping_country || "USA"
          });
          

          if (data.profileImage) {
            setPreview(data.profileImage);
          }
        })
        .catch((err) => console.error("Error loading profile:", err));
    }
  }, [userId]);

  // Handler to update form state on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
// Handler for uploading and previewing profile image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
  };
// Handler function to submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let base64Image = preview;
  
      
      if (form.profileImage && typeof form.profileImage !== "string") {
        const file = form.profileImage;
  
        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
  
        base64Image = await toBase64(file);
      }
  
      await updateProfile(base64Image);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong while updating.");
    }
  };
  
// Function to send updated profile data to server
  const updateProfile = async (imageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          username: form.username.trim(),
          profileImage: imageData,
        }),
        
      });
  
      if (response.ok) {
        alert("✅ Profile updated!");
      } else {
        const data = await response.json();
  
        
        if (data.message) {
          alert(`❌ ${data.message}`);
        } else {
          alert("❌ Failed to update profile.");
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong while updating.");
    }
  };

  
  return (
    <div>
      <Navbar />
      <main className="profile-wrapper">
        <h2>Edit Your Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="profile-image-container">
            {preview ? (
              <img src={preview} alt="Preview" className="profile-preview" />
            ) : (
              <div className="profile-placeholder">Upload Image</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Basic Info */}
          <input
           type="text"
           name="username"
           placeholder="Username"
           value={form.username}
           onChange={handleChange}
          required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <h4>Shipping Address</h4>
          <input
            type="text"
            name="shipping_address1"
            placeholder="Address Line 1"
            value={form.shipping_address1}
            onChange={handleChange}
          />
          <input
            type="text"
            name="shipping_address2"
            placeholder="Address Line 2"
            value={form.shipping_address2}
            onChange={handleChange}
          />
          <input
            type="text"
            name="shipping_city"
            placeholder="City"
            value={form.shipping_city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="shipping_state"
            placeholder="State"
            value={form.shipping_state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="shipping_zip"
            placeholder="Zip Code"
            value={form.shipping_zip}
            onChange={handleChange}
          />
          <input
            type="text"
            name="shipping_country"
            placeholder="Country"
            value={form.shipping_country}
            onChange={handleChange}
          />

          <button type="submit">Save Changes</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
