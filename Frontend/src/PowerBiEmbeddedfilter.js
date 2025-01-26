import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import axios from 'axios';

const PowerBiEmbeddedfilter = ({ filterValue }) => {
  const [embedConfig, setEmbedConfig] = useState(null);
  const [reportRef, setReportRef] = useState(null);

  // Fetch the embed token and other config from the backend
  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        const response = await axios.get('https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/api/getEmbedToken'); // Adjust URL as needed
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
                visible: false,  // Show page navigation
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

  // Apply filter to the report each time it's loaded or refreshed
  const applyFilter = async (reportRef) => {
    if (reportRef && filterValue) {  // Ensure filterValue is available
      try {
        // Get the pages of the report
        const pages = await reportRef.getPages();
        const specificPage = pages.find(page => page.displayName === "MSK LabAll");

        if (specificPage) {
          await specificPage.setActive();

          // Get all visuals on the page
          const visuals = await specificPage.getVisuals();
          console.log('Visuals:', visuals);  // Log all visuals

          // Find the specific visual by type or ID
          const specificVisual = visuals.find(v => v.name === '76d02a1ecbb059cda952');  // Adjust if necessary
          if (specificVisual) {
            console.log('Specific Visual:', specificVisual);  // Log specific visual details
            
            // Apply the dynamic filter using filterValue from the textbox
            const filter = {
              $schema: "http://powerbi.com/product/schema#basic",
              target: {
                table: "p149phonesensors",  // Replace with your table name
                column: "ID",               // Replace with your column name
              },
              operator: "In",
              values: [filterValue],  // Use the dynamic value from textbox
            };

            await specificVisual.updateFilters(models.FiltersOperations.Replace, [filter]);
            console.log('Filter applied successfully with value:', filterValue);
          } else {
            console.error('Specific visual not found');
          }
        } else {
          console.error('Page not found');
        }
      } catch (error) {
        console.error('Error applying filter:', error);
      }
    }
  };

  // Re-apply the filter every time the filterValue changes
  useEffect(() => {
    if (reportRef) {
      applyFilter(reportRef);  // Apply the filter whenever the filterValue changes
    }
  }, [reportRef, filterValue]);  // Re-run the effect when filterValue changes

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

export default PowerBiEmbeddedfilter;










// ******************************************************************************

// import React, { useEffect, useState } from 'react';
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';
// import axios from 'axios';

// const PowerBiEmbedded = () => {
//   const [embedConfig, setEmbedConfig] = useState(null);
//   const [visualRef, setVisualRef] = useState(null);

//   // Fetch the embed token and other config from the backend
//   useEffect(() => {
//     const fetchEmbedToken = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/getEmbedToken');  // Adjust URL as needed
        
//         // Set configuration to embed a specific visual using the report and visual IDs from the URL
//         setEmbedConfig({
//           type: 'visual',
//           embedUrl: response.data.embedUrl,
//           tokenType: models.TokenType.Embed,
//           accessToken: response.data.embedToken,
//           id: 'aaa87d4e-0688-4c24-94b4-98bace31ed8f',  // Report ID from the URL
//           pageName: 'HoldingScreen',  // Use 'ReportSection' if it's the page name
//           visualName: 'fc89414112d979754162',  // Visual ID from the URL
//           settings: {
//             panes: {
//               filters: {
//                 visible: false,  // Hide filters pane
//               },
//               pageNavigation: {
//                 visible: true,  // Hide page navigation
//               },
//             },
//           },
//         });
//       } catch (error) {
//         console.error('Error fetching embed token', error);
//       }
//     };

//     fetchEmbedToken();
//   }, []);

//   if (!embedConfig) {
//     return <div>Loading Power BI visual...</div>;
//   }

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <PowerBIEmbed
//         embedConfig={embedConfig}
//         cssClassName="report-style-class"
//         getEmbeddedComponent={(embeddedVisual) => {
//           console.log('Visual embedded:', embeddedVisual);
//           setVisualRef(embeddedVisual);  // Set reference to the embedded visual
//         }}
//       />
//     </div>
//   );
// };

// export default PowerBiEmbedded;