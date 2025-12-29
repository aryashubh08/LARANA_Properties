import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/slices/state";

const Navbar = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [dropdownMenu, setDropDownMenu] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDownMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("user"); // clear localStorage
    localStorage.removeItem("token"); // clear token
    navigate("/login");
  };

  return (
    <div className="fixed top-0 z-49 bg-white shadow-md px-10 flex w-full items-center justify-between">
      <Link to="/" className="max-md:w-20">
        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-30 h-25 object-contain"
        />
      </Link>

      <div className="flex max-sm:hidden items-center justify-center border border-gray-300 rounded-full py-2 px-6 relative">
        <input
          type="text"
          placeholder="Search..."
          className="outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="absolute mt-1 right-4"
          onClick={() => {
            navigate(`/get-listing/search/${search}`);
          }}
          disabled={search === ""}
        >
          <IoIosSearch className=" text-lg text-gray-600" />
        </button>
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

          {user?.profileImagePath ? (
            <img
              className="object-cover rounded-full w-8 h-8"
              src={user.profileImagePath}
              alt="profile"
            />
          ) : (
            <FaUser className="text-lg text-gray-600" />
          )}

          {/* DROPDOWN */}
          {dropdownMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute flex flex-col font-normal border z-50 border-gray-300 bg-white p-3 right-0 top-[110%] w-36 text-sm rounded-xl"
            >
              {!user ? (
                <>
                  <Link to="/login" className="hover:bg-gray-200 p-1 rounded">
                    LogIn
                  </Link>
                  <Link
                    to="/register"
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/${user._id}/trips`}
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Trip List
                  </Link>
                  <Link
                    to={`/${user._id}/wishList`}
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Wish List
                  </Link>
                  <Link
                    to={`/${user._id}/propertyList`}
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Property List
                  </Link>
                  <Link
                    to={`/${user._id}/reservationList`}
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Reservation List
                  </Link>
                  <Link
                    to="/create-listing"
                    className="hover:bg-gray-200 p-1 rounded"
                  >
                    Become A Host
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left hover:bg-gray-200 p-1 rounded"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
