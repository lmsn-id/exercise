"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

export default function DashboardHome() {
  const slides = [
    {
      image: "/image/bg1.png",
      title: "School Of Technopreneur Nusantara",
      subtitle: "Greetings Archipelago",
      description:
        " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio reprehenderit quo odit quisquam, ab reiciendis corrupti nisi porro ullam! Cum praesentium adipisci reiciendis eveniet voluptatum itaque, cupiditate non laboriosam quibusdam!",
      textPosition: "left",
      container: "md:w-1/2 ",
      styleTitle:
        "text-xl md:text-2xl lg:text-4xl font-bold uppercase text-shadow lg:w-[50rem]",
      styleSubtitle:
        "text-3xl md:text-5xl font-extrabold text-shadow lg:w-[50rem]",
      styleDescription: "text-md md:text-xl font-medium text-shadow",
    },
    {
      image: "/image/bg2.jpg",
      title: "High Quality Lecturers",
      subtitle: "",
      description:
        "We Provide You With The Best Quality Education Through The Most Competent Lecturers And Creative Way Of Learning",
      textPosition: "center",
      container: "md:w-full flex flex-col items-center",
      styleTitle:
        "text-4xl md:text-6xl lg:text-7xl font-mono font-black text-shadow",
      styleSubtitle: "",
      styleDescription:
        "text-lg md:text-2xl lg:text-4xl font-bold md:w-1/2 lg:w-[70rem] drop-shadow-2xl text-shadow",
    },
  ];
  return (
    <>
      <section className="relative  w-full min-h-[calc(100vh-10rem)] md:h-[calc(100vh-10rem)] h-[calc(50vh)] z-0 ">
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          speed={2500}
          className="relative z-20 flex flex-col h-full px-5 md:px-10 lg:mx-20 "
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="transition duration-[2.5s] ease-in-out transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <div className="absolute inset-0">
                <Image
                  className="w-full h-full object-cover brightness-75 transition duration-[2.5s] ease-in-out hover:brightness-90"
                  src={slide.image}
                  fill
                  alt="Background"
                />
              </div>

              <div
                className={`relative z-20 flex flex-col h-full px-5 md:px-10 lg:mx-20 items-center justify-center ${
                  slide.textPosition === "left"
                    ? "md:items-start md:text-left"
                    : slide.textPosition === "center"
                    ? "md:items-center md:text-center"
                    : "md:items-end md:text-right"
                } text-center`}
              >
                <div className={`text-white mb-5 md:mb-0 ${slide.container}`}>
                  <h4
                    className={` tracking-wider mb-3 md:mb-5 ${slide.styleTitle}`}
                  >
                    {slide.title}
                  </h4>

                  <h1
                    className={`mb-3 md:mb-5 leading-tight drop-shadow-lg ${slide.styleSubtitle}`}
                  >
                    {slide.subtitle}
                  </h1>

                  <p
                    className={`text-gray-200 leading-relaxed mb-4 md:mb-6 drop-shadow ${slide.styleDescription}`}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
