import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/slices/state";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [dropdownMenu, setDropDownMenu] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="fixed top-0 z-100 bg-white  shadow-md  px-10 flex w-full items-center justify-between">
      <Link to="/" className="max-md:w-20">
        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-30 h-25 object-contain"
        />
      </Link>

      <div className="flex max-sm:hidden items-center justify-center border border-gray-300 rounded-full py-2 px-6 relative">
        <input type="text" placeholder="Search..." className="outline-none" />
        <IoIosSearch className="absolute mt-1 right-4 text-lg text-gray-600" />
      </div>

      <div className="flex max-md:text-sm items-center justify-center gap-3 font-semibold">
        <Link to={user ? "/create-listing" : "/login"}>
          <h1>Become A Host</h1>
        </Link>

        {/* Dropdown Wrapper */}
        <div
          ref={dropdownRef}
          onClick={() => setDropDownMenu(!dropdownMenu)}
          className="border border-gray-300 relative cursor-pointer rounded-full px-4 py-1 flex items-center justify-center gap-2"
        >
          <FiMenu className="text-2xl text-gray-600" />

          {!user ? (
            <FaUser className="text-lg text-gray-600" />
          ) : (
            <img
              className="object-cover rounded-full w-8 h-8"
              src={user.profileImagePath}
              alt="profile"
            />
          )}

          {/* DROPDOWN */}
          {dropdownMenu && !user && (
            <div className="absolute right-0 top-[110%] bg-white border border-gray-300 rounded-xl p-3 flex flex-col w-36 text-sm">
              <Link to="/login">LogIn</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}

          {dropdownMenu && user && (
            <div className="absolute flex flex-col font-normal border border-gray-300 bg-white p-3 right-0 top-[110%] w-36 text-sm rounded-xl">
              <Link className="hover:bg-gray-200 p-1 rounded">Trip List</Link>
              <Link className="hover:bg-gray-200 p-1 rounded">Wish List</Link>
              <Link className="hover:bg-gray-200 p-1 rounded">
                Property List
              </Link>
              <Link className="hover:bg-gray-200 p-1 rounded">
                Reservation List
              </Link>
              <Link className="hover:bg-gray-200 p-1 rounded">
                Become A Host
              </Link>

              <Link
                className="text-left hover:bg-gray-200 p-1 rounded"
                onClick={() => dispatch(setLogout())}
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
