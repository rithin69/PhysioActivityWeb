import React from 'react';

const PowerBIReport = () => {
  return (
    <div className="powerbi-report-container w-full h-full">
      <iframe
        className="powerbi-iframe w-full h-full"
        src="https://app.powerbi.com/view?r=eyJrIjoiNWQwYjIyMmItMDQwYS00ZWNkLWI1NmEtYTEyZTA4MDcyMDEwIiwidCI6IjA4YjQ0NjczLTE4NzMtNGViNS05MGQ3LTZlYWUyMTg3MDc4YSJ9"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PowerBIReport;
