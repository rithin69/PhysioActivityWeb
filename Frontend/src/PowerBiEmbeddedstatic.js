import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import axios from 'axios';

const PowerBiEmbeddedstatic = () => {
  const [embedConfig, setEmbedConfig] = useState(null);

  // Fetch the embed token and other config from the backend
  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        const response = await axios.get('https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/api/getEmbedToken');
        setEmbedConfig({
          type: 'report',
          embedUrl: response.data.embedUrl,
          tokenType: models.TokenType.Embed,
          accessToken: response.data.embedToken,
          settings: {
            panes: {
              filters: {
                visible: false,
              },
              pageNavigation: {
                visible: false,
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching embed token', error);
      }
    };

    fetchEmbedToken();
  }, []);

  if (!embedConfig) {
    return <div>Loading  Report...</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="report-style-class"
        getEmbeddedComponent={(embeddedReport) => {
          console.log('Report embedded:', embeddedReport);
        }}
        // style={{ height: '100%', width: '100%' }} // Ensure embed takes full space
      />
    </div>
  );
  
};

export default PowerBiEmbeddedstatic;