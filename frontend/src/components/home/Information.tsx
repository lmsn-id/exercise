export default function InformationHome() {
  return (
    <>
      <section className="flex flex-col items-center -translate-y-20 sm:-translate-y-0">
        <div className="flex flex-wrap flex-col lg:flex-row items-center justify-center container mx-auto px-4">
          <div className="w-full lg:w-1/2 max-w-6xl p-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                WELCOME TO JOIN
              </h1>
              <h2 className="text-xl md:text-4xl font-bold text-gray-900">
                SCHOOL OF TECHNOPRENEUR NUSANTARA (SOTN)
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mt-2">
                College for Future Technopreneur
              </p>
            </div>
            <hr className="border-t-2 border-black w-16 my-4" />
            <p className="text-gray-700 text-base md:text-lg">
              Yayasan STMIK Harvest memiliki sebuah perguruan tinggi bernama
              <strong> STMIK KUWERA (KESATUAN USAHA WIRA EKA NUSANTARA)</strong>
              atau dikenal sebagai
              <strong> SCHOOL OF TECHNOPRENEUR NUSANTARA (SOTN)</strong>.
              Berdiri sejak 1987, bermula di Jakarta Selatan, hingga saat ini
              masih berdiri dengan visi dan misi yang baru dan lebih terdepan
              mengikuti perkembangan zaman teknologi saat ini.
            </p>
          </div>

          <div className="w-full lg:w-1/2 max-w-6xl p-6 flex justify-center lg:justify-end">
            <div className="w-full lg:w-2/3">
              <video controls className="rounded-lg shadow-lg w-full ">
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 w-full p-6 mt-6 text-center">
          <p className="font-bold text-xl">Ready To Join ?</p>
          <p className="text-gray-700 md:text-lg">
            It Easy Now To You For Being Our Part Just Click The Button Below
            And Fill Out The Form With Your Data
          </p>
          <button className="bg-[#18563F] hover:bg-[#0d4430] text-white font-bold px-6 py-3 mt-4 rounded-lg">
            REGISTER
          </button>
        </div>
      </section>
    </>
  );
}
