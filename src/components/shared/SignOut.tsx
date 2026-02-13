import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {  LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignOut = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logOut = () => {
    dispatch(
      setUser({
        name: "",
        email: "",
        role: "",
        token: "",
      })
    );
    Cookies.remove("token");

    router.push("/");
  };
  return (
    <button
      onClick={() => logOut()}
      className=" flex items-center gap-2 text-red-600 py-3 hover:bg-red-100 w-full  font-medium pl-4"
    >
      <LogOut />
      Sign Out
    </button>
  );
};

export default SignOut;
