"use client"

import SendWithdrawRequestModal from "@/components/worker/SendWithdrawRequestModal";
import { useMywithdrawHistoryQuery } from "@/redux/features/withdraw/withdraw.api";

const WithdrawPage = () => {
    const {data, isLoading} = useMywithdrawHistoryQuery("");
    console.log(data?.result);
    return (
        <div>
           <SendWithdrawRequestModal></SendWithdrawRequestModal> 
        </div>
    );
};

export default WithdrawPage;