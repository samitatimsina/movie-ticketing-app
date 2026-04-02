// src/components/BannerSlider.jsx
import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { banners } from "../../utils/banners";

const BannerSlider = () => {
  const navigate = useNavigate();

  const handleBannerClick = (banner) => {
  navigate(`/movie/${banner.id}/${banner.title}`, {
    state: {
      _id: banner.id,
      title: banner.title,
      posterUrl: banner.image,
      description: banner.description || "Description not available",
      rating: banner.rating || 0,
      votes: banner.votes || 0,
      duration: banner.duration || "2h 10m",
      genre: banner.genre || ["Genre Unknown"],
      certification: banner.certification || "U/A",
      releaseDate: banner.releaseDate || "2026-01-01",
      format: banner.format || ["2D"],
      languages: banner.languages || ["English"],
    },
  });
};

  const settings = {
    centerMode: true,
    centerPadding: "250px",
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    arrows: true,
    dots: true,
    responsive: [
      { breakpoint: 1280, centerMode: true, settings: { centerPadding: "400px" } },
      { breakpoint: 1024, centerMode: true, settings: { centerPadding: "200px" } },
      { breakpoint: 768, settings: { centerPadding: "60px" } },
      { breakpoint: 480, settings: { centerPadding: "0px" } },
    ],
  };

  return (
    <div className="w-full bg-white py-6 relative">
      <div className="w-full px-6 lg:px-12">
        <Slider {...settings}>
          {banners.map((banner, i) => (
            <div key={i} className="px-2 relative">
              <img
                src={banner.image}
                alt={banner.title}
                onClick={() => handleBannerClick(banner)}
                className="w-full h-40 sm:h-56 md:h-72 lg:h-[400px] rounded-xl object-cover cursor-pointer"
              />
              {banner.title && (
                <div className="absolute bottom-4 left-4 text-white font-bold text-xl shadow-lg">
                  {banner.title}
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;