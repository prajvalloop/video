
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    const user=await currentUser()
    const SECRET="123456"
    const res=await request.json()
    const { createHmac } = await import('node:crypto');
    const shasum=createHmac('sha256',SECRET)
    shasum.update(JSON.stringify(res))
    const digest=shasum.digest('hex')
    const signature=request.headers.get('x-razorpay-Signature')
    console.log('signature->',signature)
    if(signature!==digest) return NextResponse.json({ msg: "Invalid signature" }, { status: 401 });
    
    if (res.event==='order.paid'){
        console.log(res.payload)
    }
    if (res.event==='subscription.authenticated'){
        console.log("1")
        console.log(res.payload.subscription)
    }
    if(res.event==='subscription.activated'){
        console.log("2")
        console.log(res.payload.subscription)
    }
    
    console.log("yesss->",res)
    return NextResponse.json({msg:'working'})
}