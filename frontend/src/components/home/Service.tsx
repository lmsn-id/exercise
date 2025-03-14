"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";

export default function ServiceHome() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="container mx-auto px-5 translate-y-[-8.3rem] z-50">
      {isMobile ? (
        <Swiper
          loop={true}
          navigation={false}
          modules={[Navigation]}
          className="mySwiper"
        >
          {[Card, Card2, Card3, Card4].map((Component, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center h-full"
            >
              <Component />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          <Card />
          <Card2 />
          <Card3 />
          <Card4 />
        </div>
      )}
    </section>
  );
}

const Card = () => (
  <div className="group flex flex-col items-center p-4 md:p-6 bg-[#18563F] hover:bg-[#0d4430] rounded-lg shadow-md w-64 md:w-72 h-full md:h-[25rem] mx-auto">
    <div className="h-full flex flex-col justify-between items-center text-center">
      <div className="w-full flex flex-col items-center justify-between min-h-[60px] mb-5">
        <div className="h-full flex justify-center items-center">
          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-gray-300 relative">
            Direct Access to EMTEK Group Network
          </h3>
        </div>
        <div className="relative w-full">
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1/2 border-b-2 bottom-2 md:-bottom-2 border-white"></span>
        </div>
      </div>

      <p className="text-white text-sm md:text-base font-semibold flex-grow min-h-[100px] mb-5 md:mb-0">
        As part of EMTEK Group, one of the largest media and technology groups
        in Indonesia, SOTN offers students exclusive opportunities for
        internships, mentorship, and extensive industry connections.
      </p>

      <div className="w-full flex justify-center mt-auto">
        <div className="bg-white text-black font-semibold group-hover:text-white group-hover:bg-[#18563F] rounded px-4 py-2">
          <Link href="#" className="text-sm md:text-lg">
            Our Networks
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Card2 = () => (
  <div className="group flex flex-col items-center p-4 md:p-6 bg-[#18563F] hover:bg-[#0d4430] rounded-lg shadow-md w-64 md:w-72 h-full md:h-[25rem] mx-auto">
    <div className="h-full flex flex-col justify-between items-center text-center">
      <div className="relative w-full flex flex-col justify-between items-center min-h-[60px] mb-5">
        <div className="h-full flex justify-center items-center">
          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-gray-300 relative">
            Scholarships Up to 100%
          </h3>
        </div>
        <div className="relative w-full">
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1/2 border-b-2 bottom-2 md:-bottom-2 border-white"></span>
        </div>
      </div>

      <p className="text-white text-sm md:text-base font-semibold flex-grow min-h-[100px] mb-5 md:mb-0">
        SOTN provides scholarship programs of up to 100%, including through the
        KIP program, enabling students from various backgrounds to receive
        quality education without the burden of tuition fees.
      </p>

      <div className="w-full flex justify-center mt-auto">
        <div className="bg-white text-black font-semibold group-hover:text-white group-hover:bg-[#18563F] rounded px-4 py-2">
          <Link href="#" className="text-sm md:text-lg">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Card3 = () => (
  <div className="group flex flex-col items-center p-4 md:p-6 bg-[#18563F] hover:bg-[#0d4430] rounded-lg shadow-md w-64 md:w-72 h-full md:h-[25rem] mx-auto mb-5 md:mb-0">
    <div className="h-full flex flex-col justify-between items-center text-center">
      <div className="w-full flex flex-col items-center justify-between min-h-[60px] mb-5">
        <div className="h-full flex justify-center items-center">
          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-gray-300 relative">
            Modern Facilities And Building
          </h3>
        </div>
        <div className="relative w-full">
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1/2 border-b-2 bottom-2 md:-bottom-2 border-white"></span>
        </div>
      </div>

      <p className="text-white text-sm md:text-base font-semibold flex-grow min-h-[100px] mb-5 md:mb-0">
        School of Technopreneur Nusantara (SOTN) provides modern facilities and
        buildings designed to offer the best learning experience for students.
      </p>

      <div className="w-full flex justify-center mt-auto">
        <div className="bg-white text-black font-semibold group-hover:text-white group-hover:bg-[#18563F] rounded px-4 py-2">
          <Link href="#" className="text-sm md:text-lg">
            Our Gallery
          </Link>
        </div>
      </div>
    </div>
  </div>
);
const Card4 = () => (
  <div className="group flex flex-col items-center p-4 md:p-6 bg-[#18563F] hover:bg-[#0d4430] rounded-lg shadow-md w-64 md:w-72 h-full md:h-[25rem] mx-auto">
    <div className="h-full flex flex-col justify-between items-center text-center">
      <div className="w-full flex flex-col items-center justify-between min-h-[60px] mb-5">
        <div className="h-full flex justify-center items-center">
          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-gray-300 relative">
            Education Focused on Technopreneurship
          </h3>
        </div>
        <div className="relative w-full">
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1/2 border-b-2 bottom-2 md:-bottom-2 border-white"></span>
        </div>
      </div>

      <p className="text-white text-sm md:text-base font-semibold flex-grow min-h-[100px] mb-5 md:mb-0">
        SOTN integrates technology education with entrepreneurial development.
        Students not only learn technical IT skills but are also equipped with
        the knowledge and experience to build startups and lead innovations in
        the digital world.
      </p>

      <div className="w-full flex justify-center mt-auto">
        <div className="bg-white text-black font-semibold group-hover:text-white group-hover:bg-[#18563F] rounded px-4 py-2">
          <Link href="#" className="text-sm md:text-lg">
            View Programs
          </Link>
        </div>
      </div>
    </div>
  </div>
);
