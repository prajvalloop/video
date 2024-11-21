import { useState } from "react"
import axios from "axios"
export const useSubscription=()=>{
    const [isProcessing,setIsProcessing]=useState(false)
    const onSubscribe=async()=>{
        setIsProcessing(true)
        const response=await axios.get("/api/payment")
        if((response.data as any).status===200){
            return window.location.href=`${(response.data as any).session_url}`
        }
        setIsProcessing(false)
    }
    return {onSubscribe,isProcessing}
}