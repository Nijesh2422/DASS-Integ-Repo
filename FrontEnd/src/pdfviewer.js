"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const { itemid } = useParams();
  console.log(itemid);
  useEffect(() => {
    // Define function to fetch PDF from server
    const fetchPDF = async () => {
      try {
        const response = await fetch(`/pdf/${itemid}`,{
          method : "GET"
        })
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPDF();

    return () => URL.revokeObjectURL(pdfUrl);
  }, []);

  return (
<div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
  {/* Display the PDF using an iframe */}
  <iframe
    src={pdfUrl}
    width="100%"
    height="100%"
    style={{ border: "none", display: "block" }}
    frameBorder="0"
    scrolling="no"
    allowFullScreen
  ></iframe>
</div>

  );
};

export default PDFViewer;