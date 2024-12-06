import { sendEmail } from "@/actions/user";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { client } from "@/lib/prisma";

export async function POST(req:NextRequest){
    try{
        const {email}=await req.json()
        if (!email) return NextResponse.json({status:400,data:'Invalid Email format'})
        const resetToken=crypto.randomBytes(32).toString('hex')

        const expiry=new Date(Date.now()+1*60*60*1000)
        const isExistUser=await client.user.findUnique({
            where:{
                email:email
            }
        })
        if(!isExistUser) return NextResponse.json({status:400,data:'Emailid not registered'})
        const user = await client.userElectron.upsert({ where: { email }, create: { email }, update: {} });

        
        await client.resetToken.create({
            data:{
                token:resetToken,
                expiry,
                userId:user.id
            }
        })
        const resetLink=`${process.env.NEXT_PUBLIC_HOST_URL}/reset-password/${resetToken}`
        const {transporter,mailOptions}=await sendEmail(email,"Set your password",`Link is valid for 1hr ${resetLink}`)
        transporter.sendMail(mailOptions,async(error,info)=>{
            if(error) return NextResponse.json({status:400,data:'Error in sending email'})
            else console.log("👍 Email send",info)
            
        })
        return NextResponse.json({
            status:200,
            data:'Email sent'
        })
    }catch(error){
        return NextResponse.json({
            status:500,
            data:'Internal Server error'
        })
    }
}