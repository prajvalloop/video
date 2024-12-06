import { client } from "@/lib/prisma";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {token,password}=await req.json()
        const resetToken =await client.resetToken.findUnique({
            where:{token}
        })
        if(!resetToken || resetToken.expiry < new Date()){
            return NextResponse.json({
                status:400,
                data:'Invalid or expired token'
            })
        }
        await client.userElectron.update({
            where:{
                id:resetToken.userId
            },
            data:{password:password}
        })
        await client.resetToken.delete({
            where:{token}
        })
        return NextResponse.json({
            status:200,
            data:'Password reset successfully'
        })
    }catch(error){
        return NextResponse.json({status:500,data:'Internal server error'})
    }
}