import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import Hamburger from "../assets/hamburger.svg";
import CloseX from "../assets/close-x.svg";
import Button from "./Button";

const MENU_ITEMS = [
  {
    link: "#",
    text: "Home",
  },
  {
    link: "#benefits",
    text: "Benefits",
  },
  {
    link: "#how-it-works",
    text: "How it works",
  },
  {
    link: "#contact",
    text: "Contact us",
  },
];

const MOBILE_MENU_ITEMS = [...MENU_ITEMS, { link: "/login", text: "Log in" }];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleShowMenu = () => {
    setMenuVisible(true);
  };

  return (
    <div>
      <nav className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center">
          <img src={Logo} alt="kota-logo" />

          <ul className="flex items-center ml-10 gap-8 max-md:hidden">
            {MENU_ITEMS.map((menuItem, index) => (
              <li className="font-nunito" key={`menu-item-${index}`}>
                <NavLink
                  to={menuItem.link}
                  className={({ isActive }) => (isActive ? "text-primary" : "text-[#222]")}
                >
                  {menuItem.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-6 items-center max-md:hidden">
          <p>
            <Link to="/login">Log in</Link>
          </p>

          <Link to="/register">
            <p className="px-4 py-2 rounded-md bg-primary cursor-pointer text-white">Get Started</p>
          </Link>
        </div>

        <div className="hidden max-md:block" onClick={handleShowMenu}>
          <img src={Hamburger} alt="hamburger_icon" />
        </div>
      </nav>
      {menuVisible && (
        <div className="absolute top-0 left-0 w-screen h-[100vh] overflow-y-auto flex flex-col bg-white z-[9999] px-8 py-4">
          <div className="flex justify-between items-center mb-12">
            <img src={Logo} alt="Kota-logo" />
            <div onClick={handleCloseMenu}>
              <img src={CloseX} alt="close-x" />
            </div>
          </div>
          <ul className="flex flex-col gap-8 w-[100%]">
            {MOBILE_MENU_ITEMS.map((menuItem, index) => (
              <li
                className="font-nunito text-[21px] border-b-[1px] border-[#EBEBEB] py-6"
                key={`menu-item-${index}`}
              >
                <NavLink
                  to={menuItem.link}
                  className={({ isActive }) => (isActive ? "text-primary" : "text-[#222]")}
                >
                  {menuItem.text}
                </NavLink>
              </li>
            ))}

            <div className="mt-6 w-[100%]">
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}
