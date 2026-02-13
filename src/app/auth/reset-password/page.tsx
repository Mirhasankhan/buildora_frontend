"use client";
import ForgetPassword from "@/components/reset/Forget";
import NewPass from "@/components/reset/NewPass";
import Verify from "@/components/reset/Verify";
import React, { useState } from "react";

const ResetPassword = () => {
  const [active, setActive] = useState("forget");


  return (
    <div>
      {active === "forget" && <ForgetPassword setActive={setActive}/>}
      {active === "verify" && <Verify setActive={setActive}/> }
      {active === "reset" && <NewPass />}
    </div>
  );
};

export default ResetPassword;
