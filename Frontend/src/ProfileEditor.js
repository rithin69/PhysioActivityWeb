import React, { useState } from "react";
import { Pencil, Copy, ExternalLink, User, MapPin, Briefcase, Heart, MessageCircle, Star, Facebook, Instagram, Twitter, Linkedin, Award, Stethoscope } from "lucide-react";

const EditableText = ({ label, value, onSave, multiline = false, placeholder, headerStyle = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    onSave(temp);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTemp(value);
    setIsEditing(false);
  };

  return (
    <div className={headerStyle ? "mb-1" : "mb-4"}>
      {label && <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>}
      {!isEditing ? (
        <div className="group relative">
          {multiline ? (
            <p className={`leading-relaxed pr-8 ${headerStyle ? 'text-lg text-gray-700 font-medium' : 'text-gray-800'}`}>
              {value || placeholder}
            </p>
          ) : (
            <span
              className={`block pr-8 overflow-hidden text-ellipsis whitespace-nowrap ${headerStyle ? 'text-2xl font-bold text-gray-900' : 'text-gray-800'}`}
              title={value || placeholder}
            >
              {value || placeholder}
            </span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 text-gray-600 hover:text-blue-500 bg-gray-100 hover:bg-gray-200 rounded p-1 flex-shrink-0"
          >
            <Pencil size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder={placeholder}
            />
          ) : (
            <input
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageUpload = ({ src, alt, onUpload, className, label }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center">
      <div className="relative group">
        <img src={src} alt={alt} className={className} />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <label className="cursor-pointer text-white">
            <Pencil size={20} />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-2">{label}</div>
    </div>
  );
};

const ProfileEditor = () => {
  const [name, setName] = useState("Ashley Thompson");
  const [servicePrice, setServicePrice] = useState("£50");
  const [serviceCharge, setServiceCharge] = useState("50");
  const [title, setTitle] = useState("Feel strong, capable, and confident in your body.");
  const [bio, setBio] = useState("I help women reconnect with their bodies through evidence-based physiotherapy and personalized training. My approach combines movement science with compassionate care to help you feel stronger, more confident, and in control of your wellness journey.");
  const [location, setLocation] = useState("London, UK");
  const [experience, setExperience] = useState("5 years");
  const [accreditations, setAccreditations] = useState("BSc Physiotherapy, MCSP, HCPC Registered");
  const [specialties, setSpecialties] = useState("Women's Health, Sports Rehabilitation, Postpartum Recovery");
  const [image, setImage] = useState("/images/physiopropic.jpg");
  const [logo, setLogo] = useState("/images/physiologo.jpg");
  const [ctaText, setCtaText] = useState("Ready to feel stronger, more confident, and in control of your wellness?");
  const [services, setServices] = useState([
    "Personal Training: Tailored sessions to help you move better and feel stronger in your body."
  ]);
  const [philosophy, setPhilosophy] = useState("Sustainable results come from empowering women with knowledge, building strength progressively, and creating lasting habits that support long-term wellness.");
  const [testimonials, setTestimonials] = useState([
    "\"Ashley helped me feel stronger after my second baby. Her postpartum program was exactly what I needed.\" – Sarah L.",
    "\"I no longer fear movement. Ashley's rehab approach gave me confidence to get back to activities I love.\" – Jen M."
  ]);
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: ""
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to create clean URL slug from name
  const createCleanUrl = (name) => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim(); // Remove leading/trailing spaces
    
    return `https://physioactivity.com/profile/${slug}`;
  };

  // ✅ UPDATED: Modified handlePublish to save with clean filename
  const handlePublish = async () => {
    setIsLoading(true);
    
    // Create clean URL from name
    const cleanUrl = createCleanUrl(name);
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const profile = {
      name,
      title,
      bio,
      location,
      experience,
      accreditations,
      specialties,
      image,
      logo,
      ctaText,
      services,
      servicePrice,
      serviceCharge,
      philosophy,
      testimonials,
      socialMedia,
      cleanUrl: cleanUrl,
      slug: slug,
      // ✅ NEW: Add filename field that uses the clean slug
      fileName: `${slug}.json`  // This will be "ashley-thompson.json"
    };

    console.log('Profile data being sent:', profile);
    console.log('Filename will be:', profile.fileName);

    try {
      // Step 1: Send profile data and get the profile URL
      const response = await fetch("https://prod-21.uksouth.logic.azure.com:443/workflows/ec195a72fd3a45a6839ecce2fb2f8c40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Sy9RnMnNvTOxCzXAD2cq6PtXo-jE4hrbctx6hm5pqbw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await response.json();
      
      if (result.url) {
        // Use clean URL instead of the ugly Azure URL
        setProfileUrl(cleanUrl);
        setIsPublished(true);
        
        // Step 2: Send the profile URL back to save it in the blob
        const urlSaveResponse = await fetch("https://prod-21.uksouth.logic.azure.com:443/workflows/ec195a72fd3a45a6839ecce2fb2f8c40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Sy9RnMnNvTOxCzXAD2cq6PtXo-jE4hrbctx6hm5pqbw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...profile,
            profileUrl: cleanUrl, // Save the clean URL
            azureUrl: result.url, // Also save the original Azure URL for reference
            action: "saveUrl"
          }),
        });

        if (urlSaveResponse.ok) {
          console.log("Profile URL saved successfully");
        } else {
          console.warn("Profile created but URL save failed");
        }
        
        setModalOpen(true);
      } else {
        alert("Failed to get profile URL");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    alert("Profile URL copied to clipboard!");
  };

  return (
    <div className="ml-[72px] mt-[64px] bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Profile Preview */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex items-start -mt-16 mb-4">
              <div className="text-center">
                <ImageUpload
                  src={image}
                  alt="Profile"
                  onUpload={setImage}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  label="Profile Photo"
                />
                <div className="flex items-center justify-center mt-2 text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
              <div className="ml-6 mt-16 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    {/* Show preview of clean URL and filename */}
                    <div className="text-sm text-gray-500 mt-1">
                      Profile URL: {createCleanUrl(name)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Filename: {name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}.json
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPublished && profileUrl && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Copy size={16} />
                        Copy Link
                      </button>
                    )}
                    {profileUrl && (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ExternalLink size={16} />
                        View Live
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-lg text-gray-700 font-medium mt-2">{title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* All your existing editor sections remain exactly the same */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Basic Information
            </h2>
            <EditableText
              label="Full Name"
              value={name}
              onSave={setName}
              placeholder="Enter your full name"
            />
            <EditableText
              label="Professional Title"
              value={title}
              onSave={setTitle}
              placeholder="Your professional tagline"
            />
            <EditableText
              label="Location"
              value={location}
              onSave={setLocation}
              placeholder="City, Country"
            />
            <EditableText
              label="Years of Experience"
              value={experience}
              onSave={setExperience}
              placeholder="e.g., 5 years"
            />
            <EditableText
              label="About Me"
              value={bio}
              onSave={setBio}
              multiline={true}
              placeholder="Tell your story and what makes you unique..."
            />
          </div>

          {/* Brand Logo & Social Media */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="mr-2" size={20} />
              Brand & Social Media
            </h2>
            <div className="flex justify-center mb-6">
              <ImageUpload
                src={logo}
                alt="Brand Logo"
                onUpload={setLogo}
                className="w-32 h-20 object-contain border border-gray-200 rounded-lg"
                label="Upload your brand logo"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect With Me</h3>
              <p className="text-sm text-gray-600 mb-4">Stay updated with my latest tips, success stories, and wellness insights across all platforms</p>
              <div className="flex justify-center gap-3 mb-4">
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 transition-colors">
                    <Twitter size={18} />
                  </a>
                )}
                {socialMedia.linkedin && (
                  <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                    <Linkedin size={18} />
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <EditableText
                  label="Facebook URL"
                  value={socialMedia.facebook}
                  onSave={(val) => setSocialMedia({ ...socialMedia, facebook: val })}
                  placeholder="https://facebook.com/yourprofile"
                />
                <EditableText
                  label="Instagram URL"
                  value={socialMedia.instagram}
                  onSave={(val) => setSocialMedia({ ...socialMedia, instagram: val })}
                  placeholder="https://instagram.com/yourprofile"
                />
                <EditableText
                  label="Twitter URL"
                  value={socialMedia.twitter}
                  onSave={(val) => setSocialMedia({ ...socialMedia, twitter: val })}
                  placeholder="https://twitter.com/yourprofile"
                />
                <EditableText
                  label="LinkedIn URL"
                  value={socialMedia.linkedin}
                  onSave={(val) => setSocialMedia({ ...socialMedia, linkedin: val })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2" size={20} />
              Accreditations & Certifications
            </h2>
            <EditableText
              label="Professional Qualifications"
              value={accreditations}
              onSave={setAccreditations}
              multiline={true}
              placeholder="List your qualifications, certifications, and professional memberships..."
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="mr-2" size={20} />
              Areas of Expertise
            </h2>
            <EditableText
              label="Specialties"
              value={specialties}
              onSave={setSpecialties}
              multiline={true}
              placeholder="List your areas of specialization and expertise..."
            />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Heart className="mr-2" size={20} />
            What I Offer
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
              <div className="flex-1 w-full">
                <EditableText
                  label="Service"
                  value={services[0]}
                  onSave={val => setServices([val])}
                  multiline={true}
                  placeholder="Describe your service offering..."
                />
              </div>
              <div className="w-full md:w-40">
                <EditableText
                  label="Payment Amount"
                  value={serviceCharge}
                  onSave={setServiceCharge}
                  placeholder="50"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Numeric value for payments (e.g., 50 for £50)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy & Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="mr-2" size={20} />
              My Philosophy
            </h2>
            <EditableText
              label="Your Approach"
              value={philosophy}
              onSave={setPhilosophy}
              multiline={true}
              placeholder="Share your professional philosophy and approach..."
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="mr-2" size={20} />
              Client Testimonials
            </h2>
            <div className="space-y-4">
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
                  multiline={true}
                  placeholder="Add a client testimonial..."
                />
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Call to Action</h2>
          <EditableText
            label="Closing Message"
            value={ctaText}
            onSave={setCtaText}
            multiline={true}
            placeholder="Your compelling call to action message..."
          />
        </div>

        {/* Publish Button */}
        <div className="text-center">
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Publishing...' : (isPublished ? 'Update Profile' : 'Publish Profile')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isPublished ? 'Profile Updated!' : 'Profile Published!'}
              </h2>
              <p className="text-gray-600 mb-6">Your professional profile is now live and ready to share with patients.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Your Clean Profile URL:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  ✨ This clean URL is perfect for sharing with patients!
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  View Profile
                </a>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;
