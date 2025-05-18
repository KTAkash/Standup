import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  useEffect(() => {
    const handleScroll = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener('click', handleScroll);
    return () => {
      document.removeEventListener('click', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Left Side (white) */}
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* Right Side (gradient) with wave SVG */}
      <div className="absolute inset-0 z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 512 512"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <h1>hello</h1>
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B5998" />
              <stop offset="100%" stopColor="#B0C4DE" />
            </linearGradient>
          </defs>
          <path
            d="M256,0 C280,100 280,400 256,512 L512,512 L512,0 Z"
            fill="url(#blueGradient)"
          />
        </svg>
        
      </div>

      {/* Content on top */}
     <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      {/* Header - Dark Blue */}
      <header className="fixed top-0 w-full bg-[#1E3A8A] p-4 shadow-lg flex justify-between items-center px-6 md:px-10 text-white z-50">
        <h1 className="text-2xl font-bold text-white"></h1>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><a href="#home" className="hover:underline text-lg text-white">Home</a></li>
            <li><a href="#about" className="hover:underline text-lg text-white">About Us</a></li>
            <li><a href="#contact" className="hover:underline text-lg text-white">Contact Us</a></li>
            <li>
              <Link 
                to="/login" 
                className="bg-white text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* Main Content - White Background */}
      <main className="flex flex-col items-center justify flex-grow w-full mt-[-100] px-5 bg-white">
       
      </main>

      {/* Footer - Dark Blue */}
      <section id="home" className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px- lg:px-8 ">
  <div className="container mx-auto">
    <div className="flex flex-col md:flex-row items-center justify-between gap-5">
      {/* Left side - Logo with hover effect */}
      <div className="fixed top-0 left-4 z-50"> {/* Changed to fixed positioning */}
      <div className="">
        <img 
          src="image\logo-removebg-preview.png" 
          alt="Stand Up Logo" 
          className="w-60 h-60 md:w-70 md:h-70 object-contain transition-transform duration-500 group-hover:scale-110" 
        />
      <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
  </div>
  
</div>
<div className="relative w-full md:w-1/3 flex justify-center absolute ">
  <div className="relative w-[200px] h-[200px]">
    {/* Foreground Image (Student) */}
    <img 
      src="/image/white_background_image__1_-removebg-preview.png" 
      alt="Student Giving Thumbs Up" 
      className="absolute right-0 z-10 w-90 h-120 md:w-10 md:h-120 mt-10"
    />
  </div>
</div>


      {/* Center - Welcome text */}
<div className="w-full md:w-1/3 flex flex-col items-center">

  {/* Typing animation container with hover zoom */}
 
  
  <p className="text-lg text-gray-600 max-w-md ">
  Eliminating defect in school traditional exam evaluation system
</p>

  {/* Add this to your global CSS or CSS-in-JS */}
  <style jsx>{`
    .typing-animation {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 2px solid transparent;
      animation: typing 3s steps(18, end) forwards;
    }

    .typing-cursor {
      animation: blink 1s step-end infinite;
      opacity: 0;
      animation-delay: 3s;
    }

    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }

    @keyframes blink {
      from, to { opacity: 0 }
      50% { opacity: 1 }
    }
  `}</style>
</div>

      {/* Right side - Student image with hover effect */}
      
    </div>
  </div>
</section>


      <section id="about" className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">About Us</h2>
        <p className="max-w-2xl text-base sm:text-lg md:text-xl mt-4">We provide a seamless evaluation system for students and teachers.</p>
      </section>



      <section id="contact" className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl">Contact Us</h2>
        <p className="text-base sm:text-lg md:text-xl mt-4">Email: support@standupeval.com | Phone: +123 456 7890</p>
      </section>

      <footer className="w-full p-6 bg-[#1E3A8A] text-center text-white">
        <p className="text-lg">Contact Us: support@standupeval.com | +123 456 7890</p>
      </footer>
    </div>
    </div>

  );
}