import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfileViewer() {
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
    <div className="bg-white text-gray-800 font-sans scroll-smooth">
      {/* Header */}
      <header className="bg-[#104378] py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="PhysioActivity Logo" className="h-12" />
          <span className="text-white text-xl font-bold tracking-wide">PhysioActivity</span>
        </div>
        <span className="text-white text-lg font-medium">Partnering with {profile.name}</span>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-[#4cb6c3] to-[#104378] text-white relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="mx-auto w-80 h-80 rounded-full mb-6 object-cover border-4 border-white shadow-2xl"
        />
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{profile.title}</h1>
        <p className="text-xl max-w-2xl mx-auto font-light leading-relaxed">{profile.bio}</p>
        {profile.logo && (
          <img
            src={profile.logo}
            alt="Logo"
            className="absolute top-6 right-8 w-20 h-20 object-contain drop-shadow-lg"
          />
        )}
      </section>

      {/* Promo Section */}
      <section className="text-center py-24 px-6 bg-[#e50000] text-white relative">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Hi, I’m {profile.name}</h2>
        <h3 className="text-6xl md:text-7xl font-black text-yellow-300 mb-4">{profile.bio}</h3>
        <p className="text-xl mb-6 font-light">{profile.location}</p>
      
      </section>

     

      {/* Services Section */}
      {profile.services?.length > 0 && (
        <section className="bg-gradient-to-br from-[#d0f0f7] via-[#f7faff] to-[#ffffff] py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-14 text-[#104378]">What I Offer</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {profile.services.map((service, idx) => {
                const [title, ...desc] = service.split(":");
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#4cb6c3] transform hover:scale-105 transition-all"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-[#104378]">{title.trim()}</h3>
                    <p className="text-gray-700">{desc.join(":").trim()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      {profile.philosophy && (
        <section className="py-24 px-6 max-w-3xl mx-auto text-center bg-gradient-to-br from-[#fef6f2] to-[#e8f5e9] rounded-xl">
          <h2 className="text-4xl font-bold mb-6 text-[#104378]">My Philosophy</h2>
          <p className="text-xl font-light text-gray-700 leading-relaxed">{profile.philosophy}</p>
        </section>
      )}

      {/* Testimonials */}
      {profile.testimonials?.length > 0 && (
        <section className="bg-gradient-to-br from-[#fdf6f9] via-[#f1f8ff] to-[#e3f2fd] py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#104378]">Client Love</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {profile.testimonials.map((quote, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-[#4cb6c3]"
                >
                  <p className="italic text-gray-700">
                    {quote.replace(/^"|"$/g, "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="text-center py-24 px-6 bg-[#104378] text-white">
        <h3 className="text-3xl font-bold mb-4">Get Started Today</h3>
        <p className="text-lg mb-6 max-w-xl mx-auto leading-relaxed">{profile.ctaText}</p>
        {profile.qr && (
          <img
            src="/images/qr.png"
            alt="QR Code"
            className="mx-auto w-56 h-56 rounded-xl shadow-lg border-4 border-white hover:scale-105 transition"
          />
        )}
      </section>
    </div>
  );
}
