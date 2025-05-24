import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfileViewer = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://physioprofile.blob.core.windows.net/profile/${id}`);
        if (!res.ok) throw new Error("Profile not found.");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [id]);

  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!profile) return <div className="p-6 text-center text-gray-600">Loading profile...</div>;

  return (
    <div className="bg-white text-gray-800 font-sans leading-relaxed">
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 px-6 md:px-20 text-center">
        <img
          src={profile.image}
          alt="Profile"
          className="mx-auto w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Hi, I’m {profile.name}</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">{profile.title}</p>
      </section>

      {/* About / Bio Section */}
      <section className="py-12 px-6 md:px-20 text-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-base">{profile.bio}</p>
      </section>

      {/* What I Offer Section */}
      <section className="bg-gray-50 py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">What I Offer</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-bold mb-2">Personal Training</h3>
            <p className="text-gray-600">Tailored sessions to help you move better, build strength, and feel powerful in your daily life.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Physiotherapy Rehab</h3>
            <p className="text-gray-600">Evidence-based care to support recovery from injury, manage pain, and restore optimal function.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Postpartum Strength</h3>
            <p className="text-gray-600">Compassionate coaching to rebuild core strength and reconnect with your body post-baby.</p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">My Philosophy</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          Sustainable results come from empowering women with tools they can use for life.
          I'm here to help you grow stronger — not just in the gym, but in every part of your life.
          We work together to create progress that feels good, honors your body, and sticks.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">Client Love</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <blockquote className="text-gray-700 italic">"Ashley helped me feel stronger after my second baby than I did before pregnancy. She's truly amazing." – Sarah L.</blockquote>
          <blockquote className="text-gray-700 italic">"I no longer fear movement. Ashley's rehab approach was empowering and changed how I see my body." – Jen M.</blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-12 px-6 md:px-20 text-center text-white">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Take the first step toward feeling stronger, more confident, and in control of your wellness.</p>
        <a
          href="https://physioprofile.z33.web.core.windows.net"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit My Website
        </a>
      </section>
    </div>
  );
};

export default ProfileViewer;
