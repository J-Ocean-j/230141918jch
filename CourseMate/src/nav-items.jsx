import { HomeIcon, Search, Calendar } from "lucide-react";
import Index from "./pages/Index.jsx";
import CourseBrowser from "./pages/CourseBrowser.jsx";
import MySchedule from "./pages/MySchedule.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "课程浏览",
    to: "/courses",
    icon: <Search className="h-4 w-4" />,
    page: <CourseBrowser />,
  },
  {
    title: "我的课表",
    to: "/schedule",
    icon: <Calendar className="h-4 w-4" />,
    page: <MySchedule />,
  },
  {
    title: "课程详情",
    to: "/course/:id",
    page: <CourseDetail />,
  },
];
