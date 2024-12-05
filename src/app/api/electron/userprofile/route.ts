import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { client } from "@/lib/prisma";




export async function POST(req:NextRequest){
    try{
    const {token}=await req.json()
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey as string);
    const userId = (decoded as any).userId;
    const emailId=(decoded as any).email
    const user=await client.userElectron.findUnique({
        where:{
            id:userId
        }
    })
    if(!user) return NextResponse.json({status:400,data:'User not found'})
    const userProfile=await client.user.findUnique({
            where:{
                email:emailId
            },
            include:{
                studio:true,
                subscription:{
                    select:{
                        plan:true
                    }
                }
            }
    })
    if(userProfile){
    return NextResponse.json({status:200,user:userProfile})
    }
    }catch(error){
        return NextResponse.json({status:500,data:'Invalid token'})
    }
}
