import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📸 My Photo Gallery</h1>
      <UploadForm onUpload={handleUpload} />
      <Gallery refresh={refresh} />
    </div>
  );
}

export default App;
