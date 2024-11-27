
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay"
const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID as string, key_secret: process.env.RAZORPAY_KEY_SECRET as string })
export async function GET (){
    try{
    const user=await currentUser()
    if(!user) return NextResponse.json({status:404})
    const priceId=process.env.RAZORPAY_PLAN_ID as string
    const options={
        plan_id: priceId,
        customer_notify: true,
        total_count: 12,
        notes:{
            clerkid:user.id
        }
        
       
        
        
      }
    const session=await instance.subscriptions.create(options)
    if(session){
    return NextResponse.json({
        status:200,
        session_url:session.short_url,
        cusomer_id:session.id,
        plan_id:session.plan_id
    })
}
    return NextResponse.json({status:400})
}catch(error){
    return NextResponse.json({status:400})
}
}
