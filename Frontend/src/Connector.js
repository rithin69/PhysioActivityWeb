import React from 'react';
import AppCard from './Appcard';


function Connector() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Connect Apps</h1>
      <div className="grid grid-cols-2 gap-4">
        <AppCard name="Apple Health" icon="/images/applehealth.png" />
        <AppCard name="Strava" icon="/images/strava.png" />
        <AppCard name="FitBit" icon="/images/fitbit.png" />
        <AppCard name="Garmin" icon="/images/garmin.png" />
      </div>
    </div>
  );
}

export default Connector;
