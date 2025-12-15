import React, { useState } from "react";
import logo from "../../assets/logo.png";
import darkLogo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";

function Sidebar({ isSidebarVisible, setIsSidebarVisible }) {
  const { darkMode } = useTheme();
  const navItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    },
    {
      name: "edit-profile",
      label: "Edit Profile",
      path: "/edit-profile",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
    {
      name: "logout",
      label: "Log Out",
      path: "#",
      icon: "M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
      action: () => alert("Logged out"),
    },
  ];
  const [activeItem, setActiveItem] = useState(null);

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    window.location.href = path;
  };

  const getNavItemStyle = (item) => {
    return item === activeItem
      ? {
          backgroundColor: "#3D566E",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          marginBottom: "4px",
          borderRadius: "8px",
          fontWeight: 600,
        }
      : {
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          marginBottom: "4px",
          borderRadius: "8px",
          fontWeight: 500,
          color: "#fff",
        };
  };

  if (!isSidebarVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-40 h-screen"
      style={{
        backgroundColor: "#2E4053",
        color: "#fff",
        width: "240px",
        padding: "16px",
      }}
      tabIndex={0}
    >
      {/* Logo only (hamburger hata diya) */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={darkMode ? darkLogo : logo}
          alt="Uptoskills Logo"
          className="w-40 sm:w-44 md:w-48 mx-auto mb-6"
        />
      </div>

      {/* Navigation */}
      <nav className="nav-menu">
        {navItems.map(({ name, label, path, icon, action }) => (
          <div
            key={name}
            className="nav-item hover:bg-[#3D566E]"
            style={getNavItemStyle(name)}
            onClick={() => (action ? action() : handleNavClick(name, path))}
          >
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d={icon} />
            </svg>
            {label}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
