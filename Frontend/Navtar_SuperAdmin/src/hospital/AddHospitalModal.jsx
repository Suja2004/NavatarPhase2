import React, { useState } from "react";
import countryList from 'react-select-country-list';
import { createHospital } from "../apis/hospitalApi";
import { Loader2 } from 'lucide-react';
import Modal from "../Modal";

const AddHospitalModal = ({ onClose, fetchHospitals }) => {
  const [formData, setFormData] = useState({
    hospital_name: "",
    country: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => { },
    onCancel: null,
  });

  const countryOptions = countryList().getData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createHospital(formData);
      setModalConfig({
        title: "Success",
        message: "Hospital added successfully!",
        onConfirm: () => {
          setIsModalOpen(false);
          setFormData({ hospital_name: "", country: "", pincode: "" });
          onClose();
        },
      });
      await fetchHospitals();
      setIsModalOpen(true);
    } catch (err) {
      setModalConfig({
        title: "Error",
        message: `${err.response?.data?.detail || "Something went wrong"}`,
        onConfirm: () => setIsModalOpen(false),
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>

        <h2 className="modal-title">Add Hospital</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Hospital Name</label>
            <input
              type="text"
              value={formData.hospital_name}
              onChange={(e) =>
                setFormData({ ...formData, hospital_name: e.target.value })
              }
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
              className="form-input"
            >
              <option value="" disabled>Select Country</option>
              {countryOptions.map((country) => (
                <option key={country.value} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              required
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="button-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="button-loading">
                  <Loader2 className="spinner" />
                  Adding...
                </span>
              ) : (
                "Add Hospital"
              )}
            </button>

          </div>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </div>
  );
};

export default AddHospitalModal;
