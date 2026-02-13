import { 
  SquareChartGantt,
  BookmarkPlus,
  Calendar,
  CircleDollarSign,
  Heart
} from "lucide-react";

import { SidbarItem, TRoles, userRoles } from "@/types/common";

// Shared routes for ALL roles
const baseMenu: SidbarItem[] = [
  {
    title: "Manage Profile",
    path: "my-profile/manage-profile",
    icon: SquareChartGantt,
  },
  {
    title: "Booking History",
    path: "my-profile/manage-bookings",
    icon: BookmarkPlus,
  },
 
  // {
  //   title: "Settings",
  //   path: "profile/settings",
  //   icon: Settings,
  // },
];

// Role-specific additions
const lawyerMenu: SidbarItem[] = [
  {
    title: "Earnings Summary",
    path: "my-profile/manage-earnings",
    icon: CircleDollarSign,
  },
  {
    title: "Availability",
    path: "my-profile/availability",
    icon: Calendar,
  },
  // {
  //   title: "View Reviews",
  //   path: "profile/favourite",
  //   icon: MessageCircleMore,
  // },
];

const userMenu: SidbarItem[] = [
  {
    title: "My Favourites",
    path: "my-profile/favourites",
    icon: Heart,
  },
];

// Final generator
export const sidebarItems = (role: TRoles): SidbarItem[] => {
  if (role === userRoles.LAWYER) {
    return [...baseMenu, ...lawyerMenu];
  }

  if (role === userRoles.USER) {
    return [...baseMenu, ...userMenu];
  }

  return baseMenu;
};
