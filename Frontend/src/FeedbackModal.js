import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ReactStars from 'react-rating-stars-component';

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenModal');

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log(`Rated with ${newRating} stars`);
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenModal', 'true');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-lg w-full mx-auto h-[600px] flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>

        {/* Image */}
        <img
          src="/images/feedback.png" // Replace with your image URL
          alt="Feedback"
          className="mb-4 rounded-lg"
        />

        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          How are you finding PhysioActivity?
        </h2>

        <p className="text-lg font-medium mb-2 text-gray-600">Please rate me !!</p>

        {/* Star Rating Component */}
        <ReactStars
          count={5}
          onChange={handleRatingChange}
          size={40}
          activeColor="#ffd700"
          className="mb-4"
        />

        <div className="flex flex-col mt-auto w-full">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">
            Quick Survey
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
