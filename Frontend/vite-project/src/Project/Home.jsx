import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    // Smooth scroll handler
    const handleScroll = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        setActiveSection(targetId);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Intersection Observer for section detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.addEventListener('click', handleScroll);
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.removeEventListener('click', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      {/* Header - Dark Blue */}
      <header className="fixed top-0 w-full bg-[#1E3A8A] p-4 shadow-lg flex justify-between items-center px-6 md:px-10 text-white z-50">
        <h1 className="text-2xl font-bold text-white"></h1>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <a 
                href="#home" 
                className={`hover:underline text-lg transition-all duration-300 ${
                  activeSection === 'home' ? 'text-blue-300 scale-110' : 'text-white'
                }`}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`hover:underline text-lg transition-all duration-300 ${
                  activeSection === 'about' ? 'text-blue-300 scale-110' : 'text-white'
                }`}
              >
                About Us
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`hover:underline text-lg transition-all duration-300 ${
                  activeSection === 'contact' ? 'text-blue-300 scale-110' : 'text-white'
                }`}
              >
                Contact Us
              </a>
            </li>
            <li>
              <Link 
                to="/login" 
                className="bg-white text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="flex flex-col items-center justify flex-grow w-full mt-[-100] px-5 bg-white">
        {/* Home Section with Zoom Animation */}
        <section 
          id="home" 
          className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px- lg:px-8 transition-all duration-1000"
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              {/* Left side - Logo */}
              <div className="fixed top-0 left-4 z-50">
                <div className="group">
                  <img 
                    src="image/logo-removebg-preview.png" 
                    alt="Stand Up Logo" 
                    className="w-60 h-60 md:w-70 md:h-70 object-contain transition-all duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Center Content */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="mb-4 group cursor-pointer transition-all duration-500 transform hover:scale-105">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E3A8A] inline-block animate-zoom-in">
                    Welcome to StandUp
                  </h2>
                </div>
                <p className="text-lg text-gray-600 max-w-md animate-zoom-in-delay">
                  Eliminating defect in school traditional exam evaluation system
                </p>
              </div>

              {/* Right side - Images */}
              <div className="w-full md:w-1/3 flex justify-center ml-[-100px] w-[200px] h-[200px]">
                <div className="relative group cursor-pointer transition-all duration-500 animate-zoom-in-delay-2">
                  <img 
                    src="image/shapes-removebg-preview.png"
                    alt="Blue Splash Background"
                    className="absolute top-0 left-0 w-[900px] h-[800px] md:w-[800px] md:h-[350px] transition-transform duration-500 group-hover:scale-105"
                  />
                  <img 
                    src="/image/white_background_image__1_-removebg-preview.png" 
                    alt="Student Giving Thumbs Up" 
                    className="relative z-10 w-90 h-120 md:w-110 md:h-120 mt-10 "
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section with Zoom Animation */}
        <section 
          id="about" 
          className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gray-50"
        >
          <div className="max-w-4xl mx-auto animate-zoom-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-8">
              About <span className="text-blue-600">StandUp</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-500 hover:scale-105">
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To revolutionize the traditional exam evaluation system with modern technology, 
                  ensuring accuracy, efficiency, and transparency in academic assessments.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-500 hover:scale-105">
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To create a seamless evaluation platform that benefits both educators and students, 
                  eliminating defects in traditional systems and promoting fair assessment practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section with Zoom Animation */}
        <section 
          id="contact" 
          className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-white"
        >
          <div className="max-w-2xl mx-auto animate-zoom-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-8">
              Contact <span className="text-blue-600">Us</span>
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg transition-all duration-500 hover:scale-[1.02]">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">Get in Touch</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> mohammemdmusfir81@gmail.com
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Phone:</span> +123 456 7890
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> 123 Battaramulla, Colombo
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-[#1E3A8A] mb-4">Social Media</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                      <span className="text-lg font-medium">Facebook</span>
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors duration-300">
                      <span className="text-lg font-medium">Twitter</span>
                    </a>
                    <a href="#" className="text-pink-600 hover:text-pink-800 transition-colors duration-300">
                      <span className="text-lg font-medium">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 bg-[#1E3A8A] text-center text-white">
        <p className="text-lg">© {new Date().getFullYear()} StandUp Evaluation System. All rights reserved.</p>
      </footer>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-zoom-in {
          animation: zoomIn 0.8s ease-out forwards;
        }
        .animate-zoom-in-delay {
          animation: zoomIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-zoom-in-delay-2 {
          animation: zoomIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}