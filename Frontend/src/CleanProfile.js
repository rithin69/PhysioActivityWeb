import React from 'react';
import { useParams } from 'react-router-dom';

const CleanProfile = () => {
  const { id } = useParams();
  const profileData = JSON.parse(localStorage.getItem(id));

  if (!profileData) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        fontFamily: 'Arial, sans-serif',
        color: 'red'
      }}>
        Profile not found!
      </div>
    );
  }

  return (
    <div style={{
      margin: '50px auto',
      padding: '20px',
      maxWidth: '600px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      textAlign: 'left'
    }}>
      {profileData.photo && (
        <img
          src={profileData.photo}
          alt="Profile"
          style={{
            display: 'block',
            width: '150px',
            height: '150px',
            margin: '0 auto 20px',
            borderRadius: '8px'
          }}
        />
      )}
      <p><strong>About Us:</strong> {profileData.aboutUs}</p>
      <p><strong>Testimonials:</strong> {profileData.testimonials}</p>
      <p><strong>Additional Details:</strong> {profileData.additionalDetails}</p>
    </div>
  );
};

export default CleanProfile;
