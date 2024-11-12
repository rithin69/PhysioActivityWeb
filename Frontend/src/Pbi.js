import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import axios from 'axios';

const Pbi = ({ pagename }) => {
  const [embedConfig, setEmbedConfig] = useState(null);
  const [reportRef, setReportRef] = useState(null);

  // Fetch the embed token and other config from the backend
  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        const response = await axios.get('https://physioactivity-dacvb2fxcjatc8fc.uksouth-01.azurewebsites.net/api/getEmbedToken');
        setEmbedConfig({
          type: 'report',
          embedUrl: response.data.embedUrl,
          tokenType: models.TokenType.Embed,
          accessToken: response.data.embedToken,
          settings: {
            panes: {
              filters: {
                visible: false,  // Hide filters pane
              },
              pageNavigation: {
                visible: false,  // Hide navigation pane
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

  const setActivePage = async (reportRef) => {
    if (reportRef && pagename) {
      try {
        const pages = await reportRef.getPages();
        const specificPage = pages.find(page => page.displayName === pagename);
        
        if (specificPage) {
          await specificPage.setActive();
          console.log(`Page '${pagename}' set to active`);
        } else {
          console.error(`Page '${pagename}' not found`);
        }
      } catch (error) {
        console.error('Error setting active page:', error);
      }
    }
  };

  // Set active page after the report is fully loaded
  useEffect(() => {
    if (reportRef) {
      reportRef.on("loaded", () => {
        setActivePage(reportRef);
      });
    }
  }, [reportRef, pagename]);

  if (!embedConfig) {
    return <div>Loading Power BI report...</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="report-style-class"
        getEmbeddedComponent={(embeddedReport) => {
          console.log('Report embedded:', embeddedReport);
          setReportRef(embeddedReport);
        }}
      />
    </div>
  );
};

export default Pbi;
