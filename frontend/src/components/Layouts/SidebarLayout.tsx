import { Outlet } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Sidebar from "./SideBar";
import TabBar from "./TabBar";

export default function SidebarLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={`flex ${isMobile && "flex-col"}`}>
      {!isMobile && <Sidebar />}
      <main className="bg-[#FAFAFA] w-full">
        <Outlet />
      </main>
      {isMobile && <TabBar />}
    </div>
  );
}
