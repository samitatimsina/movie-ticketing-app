import React from "react";
import mainLogo from "../../assets/movie-tickets.png";
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2b2b2b] text-gray-400 text-sm">
      <div className="border-t border-gray-600 w-full">
        <div className="flex flex-col items-center py-6 w-full">
          {/*Logo*/}
          <img src={mainLogo} alt="movie-tickets logo" className="w-28 mb-4" />
        </div>
        {/*Social icons */}
        <div className="flex space-x-4 justify-center cursor-pointer">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" /></a>
            <a href="https://www.linkedin.com/in/samita-timsina-58b27a3ab/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" /></a>
        </div>

        {/*Copyright */}
        <p className="text-center text-sm px-4 block w-full">
          Copyright 2026 ©️ MOVIETICKETS pvt Ltd. All Rights Reserved
        </p>
        <small className="text-center text-gray-500 text-xs pb-2 block w-full">
          The content and images used in this site are copyright protected with
          respected owners.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
