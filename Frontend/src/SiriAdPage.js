import React from 'react';

const SiriAdPage = () => {
  return (
    <div className="bg-blue-100 font-sans leading-normal tracking-normal">
      {/* Navigation */}
      <nav className="bg-stone-50 shadow-md">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/phy_logo.jpg" alt="Logo" className="h-16 w-28 mr-3" />
            <div className="text-4xl font-bold">NORDIC FIT  By Siri</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900">Siri Andersen</h1>
          <p className="text-xl font-light text-gray-700 mt-4">I Take The Guesswork Out of Health & Fitness</p>
          <p className="text-gray-600 mt-4">
            With over 5 years of experience as a personal trainer, I have helped countless women discover their strength, confidence, and healthy lifestyle habits.
            As your online personal trainer, I will do the same for you!
          </p>
          <div className="mt-4 space-x-4">
            <a href="#about" className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Learn More</a>
            <a href="#how-it-works" className="border border-blue-500 text-blue-500 px-3 py-2 rounded hover:bg-blue-500 hover:text-white">Watch How It Works</a>
          </div>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <img src="/images/siri.jpg" alt="Siri Andersen" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="container mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between mt-10 bg-pink-100 rounded-lg shadow-lg">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            I'm a working mum, too. My name is Siri.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            I have always been active, but exercise took a tumble when I was juggling kids, a full-time job, and studying. I qualified as a Level 3 PT in 2019, after 15 years in online marketing. I wanted to encourage other women to embrace strength training at any age, so I trained with the best in the industry to gain the necessary knowledge to best serve new mums and women going through peri/post menopause. Since then, I have helped countless women build their confidence through resistance training. Learning to lift weights in a safe and effective manner really is a game changer!
          </p>
        </div>
        <div className="md:w-1/2 p-6 flex justify-center">
          <img src="/images/abme.jpg" alt="Siri Andersen" className="w-2/3 h-auto rounded-lg shadow-lg object-cover" />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">This remote coaching programme provides:</p>
          <ul className="text-gray-600 mt-4 list-disc list-inside leading-relaxed">
            <li>Effective core strengthening exercises</li>
            <li>Pelvic floor and correct breathing techniques</li>
            <li>15-45 minute home workout routines tailored to you</li>
            <li>Nutrition advice to support individual goals</li>
            <li>Lifestyle hacks to further optimise your training</li>
            <li>Ongoing motivation and support</li>
            <li>Regular Zoom check-ins to encourage you towards your goals</li>
          </ul>
          <p className="text-gray-600 mt-4 leading-relaxed">
            If you are local to Herne Hill/Dulwich, you can choose to combine at-home workouts with in-person 1:1 Personal Training sessions. Small Groups (online or in person) are also available as a more affordable option.
          </p>
          <div className="mt-4">
            <a href="#consultation" className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Book a Free Consultation</a>
          </div>
        </div>
        <div className="p-16 md:w-1/2 mt-6 md:mt-0">
          <img src="/images/howit.jpg" alt="How It Works" className="w-2/3 h-auto rounded-lg shadow-lg" />
        </div>
      </section>

      {/* QR Code Section */}
      <section id="qr-code" className="bg-pink-100 container mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-center md:justify-between mt-10 rounded-lg shadow-lg">
        <div className="md:w-2/3 text-center md:text-left p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
            For more information about Siri's services, personalized treatment plans, and to book an appointment, scan the QR code to visit her official website.
          </h2>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end p-4 md:p-8">
          <img src="/images/qrsca.png" alt="QR Code" className="w-1/2 md:w-2/3 h-auto rounded-lg shadow-lg" />
        </div>
      </section>
    </div>
  );
};

export default SiriAdPage;
