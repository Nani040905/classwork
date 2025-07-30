import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(); // Refresh gallery
      setFile(null);
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
