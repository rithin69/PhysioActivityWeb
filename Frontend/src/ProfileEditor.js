import React, { useState } from "react";
import { Pencil } from "lucide-react";

const EditableText = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    onSave(temp);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <div className="text-sm text-gray-600">{label}</div>
      {!isEditing ? (
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">{value}</span>
          <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500">
            <Pencil size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

const ProfileEditor = () => {
  const [name, setName] = useState("Ashley Thompson");
  const [title, setTitle] = useState("Feel strong, capable, and confident in your body.");
  const [bio, setBio] = useState("I help women reconnect with their bodies...");
  const [location, setLocation] = useState("London, UK");
  const [image, setImage] = useState("/avatar-placeholder.png");
  const [logo, setLogo] = useState("/ashleylogo.png");
  const [qr, setQr] = useState("/qr.png");
  const [ctaText, setCtaText] = useState("Ready to feel stronger, more confident, and in control of your wellness?");
  const [ctaUrl, setCtaUrl] = useState("https://yourlink.com");
  const [services, setServices] = useState([
    "Personal Training: Tailored sessions to help you move better...",
    "Physiotherapy Rehab: Evidence-based care to support recovery...",
    "Postpartum Strength: Coaching to rebuild core strength..."
  ]);
  const [philosophy, setPhilosophy] = useState("Sustainable results come from empowering women...");
  const [testimonials, setTestimonials] = useState([
    "\"Ashley helped me feel stronger after my second baby...\" – Sarah L.",
    "\"I no longer fear movement. Ashley's rehab approach...\" – Jen M."
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const handleImageUpload = (file, setState) => {
    const url = URL.createObjectURL(file);
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setState(reader.result);
        };
        reader.readAsDataURL(blob);
      });
  };

  const handleFileChange = (e, setState) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, setState);
  };

  const handlePublish = async () => {
    const profile = {
      name,
      title,
      bio,
      location,
      image,
      logo,
      // qr,
      ctaText,
      // ctaUrl,
      services,
      philosophy,
      testimonials
    };

    try {
      const response = await fetch("https://prod-21.uksouth.logic.azure.com:443/workflows/ec195a72fd3a45a6839ecce2fb2f8c40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Sy9RnMnNvTOxCzXAD2cq6PtXo-jE4hrbctx6hm5pqbw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await response.json();
      if (result.url) {
        setProfileUrl(result.url);
        setModalOpen(true);
      } else {
        alert("Failed to get profile URL");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="ml-[72px] mt-[64px] p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* Image Uploads */}
        <div className="flex items-center gap-6 mb-6">
          <div className="space-y-2 text-center">
            <img src={image} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImage)} />
            <div className="text-xs text-gray-600">Profile Image</div>
          </div>
          <div className="space-y-2 text-center">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogo)} />
            <div className="text-xs text-gray-600">Logo</div>
          </div>
          {/* <div className="space-y-2 text-center">
            <img src={qr} alt="QR Code" className="w-16 h-16 object-contain" />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setQr)} />
            <div className="text-xs text-gray-600">QR Code</div>
          </div> */}
        </div>

        {/* Editable Fields */}
        <EditableText label="Name" value={name} onSave={setName} />
        <EditableText label="Title" value={title} onSave={setTitle} />
        <EditableText label="Location" value={location} onSave={setLocation} />
        <EditableText label="Bio" value={bio} onSave={setBio} />

        {/* Services */}
        <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">What I Offer</h3>
        {services.map((service, index) => (
          <EditableText
            key={index}
            label={`Service ${index + 1}`}
            value={service}
            onSave={(val) => {
              const newServices = [...services];
              newServices[index] = val;
              setServices(newServices);
            }}
          />
        ))}

        {/* Philosophy */}
        <EditableText label="My Philosophy" value={philosophy} onSave={setPhilosophy} />

        {/* Testimonials */}
        <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">Testimonials</h3>
        {testimonials.map((quote, index) => (
          <EditableText
            key={index}
            label={`Testimonial ${index + 1}`}
            value={quote}
            onSave={(val) => {
              const updated = [...testimonials];
              updated[index] = val;
              setTestimonials(updated);
            }}
          />
        ))}

        {/* CTA */}
        <EditableText label="Bottom Text" value={ctaText} onSave={setCtaText} />
        {/* <EditableText label="CTA Button URL" value={ctaUrl} onSave={setCtaUrl} /> */}

        <button
          onClick={handlePublish}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Publish
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2 text-green-600">Profile Published Successfully!</h2>
            <p className="text-gray-700 mb-4">Here is your profile URL:</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {profileUrl}
            </a>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;
