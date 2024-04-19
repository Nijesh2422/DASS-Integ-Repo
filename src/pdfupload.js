// FileUpload.js

import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = async (id) => {
        console.log(id);
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            await axios.post(`/upload/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to upload file');
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={() => handleUpload('662179ae844eb2c1e3758476')}>Upload</button>
        </div>
    );
}

export default FileUpload;
