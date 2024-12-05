import { ErrorMessage } from '@hookform/error-message';
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/prisma";
import jwt from 'jsonwebtoken';
export async function POST(req:NextRequest){
    const {email,password}=await req.json()
    try{
        const isExistUser=await client.user.findUnique({
            where:{
                email:email
            }
        })
        console.log('working fine')
        if (!isExistUser) return NextResponse.json({status:400,data:'Email doesnot exist'})
        const electronUser=await client.userElectron.findUnique({
            where:{
                email:email
            }

            })
        console.log("yes good")
        if(!electronUser) return NextResponse.json({status:400,data:'Email doesnto exist'})
        else if(electronUser?.password===password){
            const secretKey=process.env.JWT_SECRET
            console.log("secretKey->",secretKey)
            const payload={
                email:email,
                userId:electronUser?.id
            }
            console.log('token creating')
            const token = jwt.sign(payload, secretKey as string);
            console.log('token created')
            return NextResponse.json({status:200,token:token,data:'Logged in'})
        }
        return NextResponse.json({status:400,data:'Password incorrect'})
    }catch(error){
        return NextResponse.json({status:500,data:'Internal Server error'})
    }
}