'use server'

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const onAuthenticatedUser=async ()=>{
    try{
    const user =await currentUser()
    if (!user){
        return {status:403}
    }
    console.log("user->exist in clerk")
    //  db logic
    const userExist=await client.user.findUnique({
        where:{
            clerkid:user.id
        },
        include:{
            workspace:true
        }
    })
    if (userExist) {
        console.log("user exist in db")
        return {status:200,user:userExist}}
    const newUser=await client.user.create({
        data:{
            clerkid:user.id,
            email:user.emailAddresses[0].emailAddress,
            firstname:user.firstName,
            lastname:user.lastName,
            image:user.imageUrl,
            studio:{
                create:{}
            },
            subscription:{
                create:{}
            },
            workspace:{
                create:{
                    name:`${user.firstName}'s Workspace`,
                    type:'PERSONAL'
                }
            }
        },
        include:{
            workspace:true,
            subscription:{
                select:{
                    plan:true
                }
            }
        }

    })
    
    if (newUser){
        console.log("newUser created")
        return {status:201,user:newUser}}
    return {status:400}


}catch(error){
    console.log("error->",error)
    return {status:500}
}
}
export const searchUsers=async (query:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const users=await client.user.findMany({
            where:{
                OR:[{firstname:{contains:query}},
                    {email:{contains:query}},
                    {lastname:{contains:query}}
                ],
                NOT:[{clerkid:user.id}]
            },
            select:{
                id:true,
                subscription:{
                    select:{plan:true}
                },
                firstname:true,
                lastname:true,
                image:true,
                email:true
            }
        })
        if(users && users.length>0) return {status:200,data:users}
        return {status:404,data:undefined}
    }catch(error){
        return {status:500,data:undefined}

    }
}
export const getPaymentInfo=async()=>{
    try{
        const user= await currentUser()
        if(!user) return {status:404}
        const payment=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                subscription:{
                    select:{plan:true}
                }
            }
        })
        if(payment){
            return {status:200,data:payment}
        }

    }catch(error){
        return {status:400}
    }
}