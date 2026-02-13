"use client";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/redux/features/auth/authApi";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

const VerifyEmail = () => {
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();
  const email = localStorage.getItem("verify");
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState({ d1: "", d2: "", d3: "", d4: "" });
  const [timeLeft, setTimeLeft] = useState(30);
  // const [openModal, setOpenModal] = useState(false);
  // const [stripeLink, setStripeLink] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.slice(0, 1);
    if (!/^\d?$/.test(value)) return;
    const field = `d${index + 1}` as keyof typeof otp;
    const newOtp = { ...otp, [field]: value };
    setOtp(newOtp);
    if (value && index < 3) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpString = Object.values(otp).join("");
  const isComplete = otpString.length === 4;

  const handleVerify = async () => {
    const response: any = await verifyOtp({ email: email, otp: otpString });
    if (response.data) {
      toast.success(response.data.message);
      router.push("/auth/login");
      localStorage.removeItem("verify");
      // if (response.data.data?.accountLink) {
      //   setStripeLink(response.data.data.accountLink);
      //   setOpenModal(true);
      // } else {
      //   router.push("/auth/login");
      // }
    } else {
      toast.error(response.error.data.message);
    }
  };

  const handleResendOtp = async () => {
    const response = await resendOtp({ email });
    if (response.data) {
      toast.success(response.data.message);
      setTimeLeft(30);
    }
  };

  // if(!email){
  //   router.push("/")
  // }

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-2">
        <div className="flex flex-col items-center w-full bg-white md:w-3/5 lg:w-2/5 xl:w-1/3 2xl:w-1/4 shadow-lg rounded-[6px] p-6">
          <div className="p-4 bg-blue-100 rounded-full mb-3">
            <Mail className="text-blue-800 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold py-1">Verify Your Email</h1>
          <p className="text-gray-600 text-center">
            We&apos;ve sent a 4-digit verification code to
          </p>
          <p className="text-secondary font-medium">{email}</p>

          <div className="flex flex-col items-center gap-5 mt-4 w-full">
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 border rounded-[5px] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  value={otp[`d${i + 1}` as keyof typeof otp]}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  disabled={i !== 0 && !otp[`d${i}` as keyof typeof otp]}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={!isComplete || isLoading}
              className={`w-full py-2 rounded-[6px] text-white font-semibold transition ${
                isComplete ? "bg-primary hover:bg-primary/90" : "bg-gray-400"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">Didn&apos;t receive the code?</p>
              {timeLeft > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend available in {timeLeft}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-secondary font-medium hover:underline text-sm"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[420px] bg-white rounded-lg p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Setup Your Payment
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Connect your account with Stripe to start receiving payments.
              Without connecting, users won&apos;t be able to book you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                setOpenModal(false);
                router.push("/auth/login");
              }}
              className="border border-primary text-secondary py-2 px-4 rounded-[6px] w-1/2 font-medium hover:bg-gray-50 transition"
            >
              Skip for Now
            </button>
            <button
              onClick={() => {
                if (stripeLink) window.location.href = stripeLink;
              }}
              className="bg-primary text-white py-2 px-4 rounded-[6px] w-1/2 font-medium hover:bg-primary/90 transition"
            >
              Connect Stripe
            </button>
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default VerifyEmail;
