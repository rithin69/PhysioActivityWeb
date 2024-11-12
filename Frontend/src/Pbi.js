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
        const response = await axios.get('https://physioactivity-dacvb2fxcjatc8fc.uksouth-01.azurewebsites.net/api/getEmbedToken'); // Adjust URL as needed
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
                visible: false,  // Hide page navigation if not needed
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

  // Set the active page based on the pagename prop
  const setActivePage = async (reportRef) => {
    console.log(pagename);
    if (reportRef && pagename) {  // Ensure pagename is available
      try {
        const pages = await reportRef.getPages();
        
        // Find the specific page by display name
        const specificPage = pages.find(page => page.displayName === pagename);
        
        if (specificPage) {
          await specificPage.setActive();  // Set the target page as active
          console.log(`Page '${pagename}' set to active`);
        } else {
          console.error(`Page '${pagename}' not found`);
        }
      } catch (error) {
        console.error('Error setting active page:', error);
      }
    }
  };

  // Set the active page whenever pagename or reportRef changes
  useEffect(() => {
    if (reportRef) {
      setActivePage(reportRef);  // Set the page whenever reportRef or pagename changes
    }
  }, [reportRef, pagename]);  // Re-run the effect when pagename changes

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
          setReportRef(embeddedReport);  // Set reference to the embedded report
        }}
      />
    </div>
  );
};

export default Pbi;