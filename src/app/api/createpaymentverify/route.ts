
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    try{
    // const user=await currentUser()
    // console.log("hi->",request.headers.get('x-razorpay-Signature'))
    // if(!user) return NextResponse.json({status:404})
    // console.log("user->webhook",user.id)
    const SECRET="123456"
    const res=await request.json()
    const { createHmac } = await import('node:crypto');
    const shasum=createHmac('sha256',SECRET)
    shasum.update(JSON.stringify(res))
    const digest=shasum.digest('hex')
    const signature=request.headers.get('x-razorpay-Signature')
    console.log('signature->',signature)
    if(signature!==digest) return NextResponse.json({ msg: "Invalid signature" }, { status: 401 });
    
    
   
    
    if(res.event==='subscription.charged'){
    //     console.log("3")
        const sub_id=res.payload.subscription.entity.id
        const user_id=res.payload.subscription.entity.notes.clerkid
        const customer=await client.user.update({
            where:{
                clerkid:user_id
            },
            data:{
                subscription:{
                    update:{
                        data:{
                            customerId:sub_id,
                            plan:'PRO'
                        }
                    }
                }
            }
        })
    
    if(customer) return NextResponse.json({status:200}) 
    
    }

    
    
    return NextResponse.json({status:404})
}catch(error){
    console.log("error.message->",error)
    return NextResponse.json({status:500})
}
}