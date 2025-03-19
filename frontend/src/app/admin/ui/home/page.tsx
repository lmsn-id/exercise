"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";

export default function UiHome() {
  const router = useRouter();
  const baseurl = usePathname();

  const Edit = () => {
    router.push(`${baseurl}/dashboard`);
  };

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
        "text-sm md:text-base lg:text-xl font-bold uppercase text-shadow w-full",
      styleSubtitle:
        "text-base md:text-xl font-extrabold text-shadow lg:w-[50rem]",
      styleDescription: "text-sm md:text-base font-medium text-shadow",
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
        "text-lg md:text-xl lg:text-2xl font-mono font-black text-shadow",
      styleSubtitle: "",
      styleDescription:
        "text-sm md:text-lg lg:text-xl font-bold md:w-[40rem] drop-shadow-2xl text-shadow",
    },
  ];

  return (
    <>
      <section className="w-full bg-white rounded-lg">
        <div className="p-4 md:p-8 flex flex-col gap-8">
          <div className="header mb-4">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 text-center">
              User Interfacer
            </h1>
          </div>

          <div className="overflow-y-auto">
            <section className="w-full ">
              <div className="p-5 md:p-8 bg-gray-300 rounded-lg w-full ">
                <div className="mb-5 flex justify-between items-center">
                  <h2 className="text-lg md:text-xl font-bold ">Dashboard</h2>
                  <button
                    onClick={Edit}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="w-full flex justify-center">
                  <div className=" w-full lg:w-7/12 h-[35vh] md:h-[50vh] ">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      loop={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      speed={2500}
                      className="relative z-20 flex flex-col h-full"
                    >
                      {slides.map((slide, index) => (
                        <SwiperSlide
                          key={index}
                          className="transition duration-[2.5s] ease-in-out transform hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
                          <div className="absolute inset-0">
                            <Image
                              className=" transition duration-[2.5s] ease-in-out hover:brightness-90"
                              src={slide.image}
                              fill
                              alt="Background"
                            />
                          </div>

                          <div
                            className={`relative z-20 flex flex-col h-full px-5 md:px-10 items-center justify-center ${
                              slide.textPosition === "left"
                                ? "md:items-start md:text-left"
                                : slide.textPosition === "center"
                                ? "md:items-center md:text-center"
                                : "md:items-end md:text-right"
                            } text-center`}
                          >
                            <div
                              className={`text-white mb-5 md:mb-0 ${slide.container}`}
                            >
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
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
