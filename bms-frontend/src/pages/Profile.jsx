import React, { useEffect, useState } from "react";
import { tabs } from "../utils/constants";
import { IoMdAdd, IoIosLogOut } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory";
import { useAuth } from "../context/useAuth";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const { user, setUser, logout, token } = useAuth();

  const [isEditing, setIsEditing] = useState(false); // toggle edit mode
  const [formData, setFormData] = useState({}); // local editable state

  // Load user profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` ,},
        });
        const data = await res.json();
        if (data?.data) {
          setUser(data.data);
          setFormData(data.data); // sync form
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token,setUser]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleUpdate = async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Response from backend:", data);
      if (data?.data) {
        setUser(data.data);
        setIsEditing(false); // exit edit mode
      }
      console.log("Updated:", data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="bg-[#e5e5e5]">
        <div className="max-w-7xl mx-auto flex gap-6 py-2 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 ${
                activeTab === tab
                  ? "text-[#f74565]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-screen py-10 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {activeTab === "Profile" && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-800 to-[#f74565] px-6 py-6 flex gap-6 text-white">
                <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center bg-white text-gray-600">
                  <IoMdAdd size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Hi, {user?.name}</h2>
                  <small onClick={logout} className="cursor-pointer underline">
                    <IoIosLogOut className="inline" /> Logout
                  </small>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white px-6 py-6 mt-4">
                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                <div className="flex justify-between mb-3">
                  <p>Email:</p>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p>Phone:</p>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="border px-2 py-1"
                    />
                  ) : (
                    <span>{user?.phone}</span>
                  )}
                  <FiEdit
                    className="cursor-pointer text-pink-500"
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white p-6 mt-4">
                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Name</label>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className="w-full border px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label>Birthday</label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className="w-full border px-3 py-2 mt-1"
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <button
                    onClick={handleUpdate}
                    className="mt-4 px-6 py-2 bg-[#f74565] text-white rounded"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}

          {activeTab === "Your Orders" && <BookingHistory />}
        </div>
      </div>
    </>
  );
};

export default Profile;