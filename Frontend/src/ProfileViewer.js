import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { MapPin, Award, Stethoscope, Facebook, Instagram, Twitter, Linkedin, CreditCard, CheckCircle, X, AlertCircle } from "lucide-react";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51S527DGclgQ44teMIt40jAVSBlFzW9zUwk0TvzWDCMtDGJsUMn1e9jO2TRopOk7Gaxmxv7PSzC3FOE0bO4ePE6Op009DZkIwDi');

// Payment Form Component
const PaymentForm = ({ amount, profileId, profileName, onPaymentSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Call your Power Automate endpoint
      const response = await fetch('https://default08b4467318734eb590d76eae218707.8a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/8f4b064319b54e128544c4437d7e2f58/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=E0OM5OKUkRbJriL0xpWMO_UWrlbH5ek7lQOFBvUfBUA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          profileId: profileId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe (no redirect)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `Payment for ${profileName}`,
          },
        }
      });

      if (result.error) {
        setPaymentError(result.error.message);
      } else {
        // Payment succeeded
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#104378]">Complete Payment</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Session with {profileName}</span>
          <span className="text-2xl font-bold text-[#104378]">${amount}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        
        {paymentError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{paymentError}</span>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 bg-[#4cb6c3] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#3ba5b2] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pay ${amount}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          Secure payment powered by Stripe
        </div>
      </div>
    </div>
  );
};

export default function ProfileViewer() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

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

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setPaymentDetails(paymentIntent);
    setShowPaymentForm(false);
    console.log('Payment successful:', paymentIntent);
  };

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
        <p className="text-xl mb-6 font-light flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5" />
          {profile.location}
        </p>
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{profile.name}</h1>
        <p className="text-2xl mb-6 font-medium text-yellow-300">{profile.title}</p>
        {profile.experience && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 inline-block mb-6">
            <p className="text-lg font-semibold">{profile.experience} of Experience</p>
          </div>
        )}
        {profile.logo && (
          <img
            src={profile.logo}
            alt="Brand Logo"
            className="absolute top-6 right-8 w-48 h-36 object-contain drop-shadow-lg bg-white/10 backdrop-blur-sm rounded-lg p-4"
          />
        )}
        {profile.socialMedia && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Connect With Me</h3>
            <p className="text-sm mb-4 opacity-90">Stay updated with my latest tips, success stories, and wellness insights</p>
            <div className="flex justify-center gap-4">
              {profile.socialMedia.facebook && (
                <a 
                  href={profile.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
              )}
              {profile.socialMedia.instagram && (
                <a 
                  href={profile.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
              )}
              {profile.socialMedia.twitter && (
                <a 
                  href={profile.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110"
                >
                  <Twitter size={20} />
                </a>
              )}
              {profile.socialMedia.linkedin && (
                <a 
                  href={profile.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Payment Section - Shows only if serviceCharge exists */}
      {profile.serviceCharge && (
        <section className="py-16 px-6 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-2xl mx-auto">
            {paymentSuccess ? (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#104378] mb-4">Payment Successful!</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Thank you for booking your session with {profile.name}. You will receive a confirmation email shortly.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-800 mb-2">Session Details:</h4>
                    <p className="text-gray-600">Amount Paid: <span className="font-medium">${profile.serviceCharge}</span></p>
                    <p className="text-gray-600">Physiotherapist: <span className="font-medium">{profile.name}</span></p>
                    {paymentDetails && (
                      <p className="text-gray-600">Payment ID: <span className="font-mono text-sm">{paymentDetails.id}</span></p>
                    )}
                  </div>
                </div>
              </div>
            ) : !showPaymentForm ? (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-3xl font-bold text-[#104378] mb-4">Book Your Session</h3>
                  <div className="bg-gradient-to-r from-[#4cb6c3] to-[#104378] text-white rounded-xl p-6 mb-6">
                    <div className="text-4xl font-bold mb-2">${profile.serviceCharge}</div>
                    <div className="text-lg opacity-90">per session</div>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Ready to start your wellness journey? Book your personalized physiotherapy session with {profile.name} today.
                  </p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="bg-[#4cb6c3] text-white px-8 py-4 rounded-xl text-xl font-semibold hover:bg-[#3ba5b2] transition-colors flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                  >
                    <CreditCard size={24} />
                    Book Now - ${profile.serviceCharge}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Secure payment • No hidden fees • Cancel anytime
                  </p>
                </div>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={profile.serviceCharge}
                  profileId={id}
                  profileName={profile.name}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentForm(false)}
                />
              </Elements>
            )}
          </div>
        </section>
      )}

      {/* About Me Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#104378]">Hi, I'm {profile.name}</h2>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#104378]">Professional Credentials</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {profile.accreditations && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Award className="w-8 h-8 text-[#4cb6c3] mr-3" />
                  <h3 className="text-2xl font-bold text-[#104378]">Accreditations & Certifications</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{profile.accreditations}</p>
              </div>
            )}
            {profile.specialties && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Stethoscope className="w-8 h-8 text-[#4cb6c3] mr-3" />
                  <h3 className="text-2xl font-bold text-[#104378]">Areas of Expertise</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{profile.specialties}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      {profile.services?.length > 0 && (
        <section className="bg-gradient-to-br from-[#d0f0f7] via-[#f7faff] to-[#ffffff] py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-14 text-[#104378]">What I Offer</h2>
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#4cb6c3] max-w-xl w-full">
                {(() => {
                  const [title, ...desc] = profile.services[0].split(":");
                  return (
                    <>
                      <h3 className="text-2xl font-bold mb-4 text-[#104378]">{title.trim()}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{desc.join(":").trim()}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      {profile.philosophy && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#104378]">My Philosophy</h2>
            <div className="bg-gradient-to-br from-[#fef6f2] to-[#e8f5e9] rounded-2xl p-12 shadow-xl">
              <div className="text-6xl text-[#4cb6c3] mb-6">"</div>
              <p className="text-xl font-light text-gray-700 leading-relaxed italic">
                {profile.philosophy}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {profile.testimonials?.length > 0 && (
        <section className="bg-gradient-to-br from-[#fdf6f9] via-[#f1f8ff] to-[#e3f2fd] py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-[#104378]">Client Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {profile.testimonials.map((quote, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-[#4cb6c3] transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl text-[#4cb6c3] mb-4">"</div>
                  <p className="italic text-gray-700 text-lg leading-relaxed">
                    {quote.replace(/^"|"$/g, "")}
                  </p>
                  <div className="flex justify-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center py-24 px-6 bg-[#104378] text-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 leading-relaxed opacity-90">
            {profile.ctaText || "Take the first step towards a healthier, stronger you. Let's work together to achieve your wellness goals."}
          </p>
          <div className="mt-12 pt-8 border-t border-blue-400">
            <p className="text-lg opacity-90">
              Powered by <span className="font-bold">PhysioActivity</span>
            </p>
          </div>
        </div>
      </section>

      {/* Download SmartDiary Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Download SmartDiary</h2>
              <p className="text-xl text-gray-600">Get your SmartDiary on your device and start your journey today.</p>
            </div>
            
            <div className="space-y-4">
              {/* App Store Button */}
              <a 
                href="#" 
                className="flex items-center justify-between bg-gray-900 text-white rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-2 mr-4">
                    <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">Download on the</div>
                    <div className="text-xl font-semibold">App Store</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">Download on the App Store</div>
              </a>
              
              {/* Google Play Button */}
              <a 
                href="#" 
                className="flex items-center justify-between bg-gray-900 text-white rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-2 mr-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#34A853" d="M3.609 1.814L13.792 12L3.609 22.186C3.61 22.186 3.61 22.186 3.609 22.186C3.235 21.938 3 21.485 3 21V3C3 2.515 3.235 2.062 3.609 1.814Z"/>
                      <path fill="#FBBC04" d="M20.485 10.18L15.273 7.45L13.792 12L15.273 16.55L20.485 13.82C21.153 13.42 21.153 12.58 20.485 10.18Z"/>
                      <path fill="#EA4335" d="M13.792 12L3.609 1.814C3.954 1.543 4.449 1.543 4.794 1.814L13.792 12Z"/>
                      <path fill="#EA4335" d="M13.792 12L4.794 22.186C4.449 22.457 3.954 22.457 3.609 22.186L13.792 12Z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">Get it on</div>
                    <div className="text-xl font-semibold">Google Play</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">Get it on Google Play</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
