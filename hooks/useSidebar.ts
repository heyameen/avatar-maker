import useStore from "@/store";
import { AppState } from "@/types";

const useSideBar = () => {
  const isCollapsed = useStore((state: AppState) => state.isCollapsed);
  const openSidebar = useStore((state) => state.setSidebarStatus);
  const closeSidebar = useStore((state) => state.setSidebarStatus);

  return { isCollapsed, openSidebar, closeSidebar };
};

export default useSideBar;
