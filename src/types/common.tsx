import { IconType } from "react-icons";

export const userRoles = {
  USER: "User",
  LAWYER:"Lawyer"
};
export type TRoles = keyof typeof userRoles;

export interface TLoginValues {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface BookingData {
  category: string;
  service: string;
  date: string;
  timeSlot: string;
  userName: string;
  userEmail: string;
  phone: string;
  price: number;
}
export interface SidbarItem {
  title: string;
  path: string;
  parentPath?: string;
  child?: SidbarItem[];
  icon?: IconType;
}
export interface TService {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  status:string;
  date:string
  startTime:string
  service: {serviceName:string}
  imageUrls: string[];
}
export interface TCategory {
  id: string;
  overview: string;
  description: string;
  mediaUrls: string[];
}
export interface TExprt {
  id: string;
  name: string;
  imageUrl: string;
  category: { categoryName: string };
}
export type FormValues = {
  fullName: string;
  email: string;
  password: string;
  licenseNumber: string;
  yearsOfExperience: number;
  barAssociation: string;
  serviceType: string;
  fee: number;
  lawDegreeImage: FileList;
  specializations: string[];
};

export interface TPostInput {
  title: string;
  description:string
  budget: string;
  serviceType:string
  urgencyLevel: string;
  serviceId: string;
  location: string;
  
}
