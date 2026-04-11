import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import mainLogo from "../../assets/movie-tickets.png";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const Header = ({showData, type}) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
const [showDropdown, setShowDropdown] = useState(false);
  return (
  <>
      <div className='border-b border-gray-200 shadow-sm bg-white'>
        {/*Top bar*/}
        <div className='flex items-center justify-between py-4 px-6'>
            {/*Logo*/}
            <img onClick={()=>navigate("/")} src={mainLogo} alt="logo"
            className='h-6 md:h-7 max-w-[140px] object-contain cursor-pointer'
            />

            {
                type === "checkout" ? (
                    <div>
                        <h2 className='font-bold text-gray-900 text-lg md:text-xl'>Review your booking</h2>
                    </div>
                ) : (
                            <div className='text-center'>
                <h2 className='font-bold text-lg md:text-xl'>
                {showData?.movie.title}</h2>
            <p className='text-xs text-gray-500 font-semibold'>
                {dayjs(showData?.date,"YYYY-MMM-DD").format("YYYY MMM DD")}{" "}
                {dayjs(showData?.startTime).format("h:mm A")} at {showData?.theater.name +" , "+showData?.theater.city}
            </p>
            </div>
                )
            }

<div className="relative">
  {user ? (
    <>
      {/* User Icon */}
      <FaUserCircle
        size={28}
        className="cursor-pointer text-gray-700"
        onClick={() => setShowDropdown(!showDropdown)}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
          <p className="px-4 py-2 text-sm border-b">{user.name}</p>

          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  ) : (
    <Link to="/signin" className="text-sm font-medium">
      Sign In
    </Link>
  )}
</div>
        </div>
    </div>
    {/*ShowTimings*/}
   {
    type !=="checkout" &&
       (
        <>
           <div className='bg-white pt-4'>
        <div className='mx-auto px-6 pb-4 flex items-center gap-4 max-w-7xl'>
            <div className='text-sm text-gray-700'>
            <p className='text-xs text-gray-500 font-medium'>
            {dayjs(showData?.date,"YYYY-MMM-DD").format("ddd")}
            </p>
            <p className='text-xs text-gray-500 font-medium'>
            {dayjs(showData?.date,"YYYY-MMM-DD").format("MMM DD")}
            </p>
            </div>
        
        <button className={"border cursor-pointer rounded-[14px] px-8 py-3 text-sm border-black font-medium bg-gray-200"}>
            {dayjs(showData?.startTime).format("h:mm A")}
            <p className='text-[10px] text-gray-500 -mt-1'>
                {showData?.audioType.toUpperCase()}</p>
        </button>
    </div>
    </div>
    <hr className='my-2 border-gray-300 max-w-7xl mx-auto'/>
    </>)
   }
    </>
  )
}

export default Header;