import React from 'react';

const PowerBIReport = ({ userID }) => {
  // Example: Filter using userID if supported by your embed token
  const baseUrl = "https://app.powerbi.com/view?r=eyJrIjoiNWQwYjIyMmItMDQwYS00ZWNkLWI1NmEtYTEyZTA4MDcyMDEwIiwidCI6IjA4YjQ0NjczLTE4NzMtNGViNS05MGQ3LTZlYWUyMTg3MDc4YSJ9";

  // In real use, you'd embed securely using Power BI JavaScript SDK + token auth
  // For now, we just show the iframe
  const embedUrl = baseUrl; // You could append filters here if needed

  return (
    <iframe
      title="Power BI Report"
      className="w-full h-full"
      src={embedUrl}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
};

export default PowerBIReport;
