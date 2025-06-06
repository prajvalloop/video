"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import nodemailer from "nodemailer"
export const sendEmail=async(to:string,subject:string,text:string,html?:string)=>{
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.MAILER_EMAIL,
            pass:process.env.MAILER_PASSWORD
        }
    })
    console.log("user",process.env.MAILER_EMAIL)
    console.log("pass->",process.env.MAILER_PASSWORD)
    const mailOptions={
        to,subject,text,html
    }
    return {transporter,mailOptions}

}

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
                    type:'PERSONAL',
                    folders:{
                        create:{}
                    }
                },
                
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
        console.log('query->',query)
        console.log("users->",users)
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
export const getFirstView=async()=>{
    try{
        const user=await currentUser()
        if (!user) return {status:404}
        const userData=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                firstView:true
            }
        })
        console.log("userData->",userData)
        if(userData) return {status:200,data:userData.firstView}
        return {status:400,data:false}
    }catch(error){
        return {status:500}
    }
}
export const enableFirstView=async(state:boolean)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const view=await client.user.update({
            where:{
                clerkid:user.id
            },
            data:{
                firstView:state
            }
        })
        if(view) return {status:200,data:"Setting updated"}

    }catch(error){
        return {status:400}
    }
}
export const createCommentAndReply=async (userId:string,comment:string,videoId:string,commentId?:string | undefined)=>{
    try{
        if(commentId){
        const reply=await client.comment.update({
            where:{
                id:commentId
            },
            data:{
                reply:{
                    create:{
                        comment,
                        userId,
                        videoId
                    }
                }
            }
        })
    
        if(reply){
            return {status:200,data:'Reply posted'}
        }
    }
        const newComment=await client.video.update({
            where:{
                id:videoId
            },
            data:{
                Comment:{
                    create:{
                        comment,
                        userId
                    }
                }
            }
        })
        if(newComment) return {status:200,data:'New comment added'}
        return {status:400}

    }catch(error){
        return {status:500}
    }
}
export const getUserProfile=async()=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const profileIdAndImage=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                image:true,
                id:true
            }
        })
        console.log("user_profile->",profileIdAndImage)
        if (profileIdAndImage){ 
            console.log({status:200,data:profileIdAndImage})
            return {status:200,data:profileIdAndImage}
         }
        return {status:404}
    }catch(error){
        return {status:500}
    }
}
export const getVideoComments=async(id:string)=>{
    try{
        const comments=await client.comment.findMany({
            where:{
                OR:[{videoId:id},{commentId:id}],
                commentId:null
            },
            include:{
                reply:{
                    include:{
                        User:true
                    }
                },
                User:true
            }
        })
        return {status:200,data:comments}
        
    } catch(error){
        return {status:500}
    }
}
export const inviteMembers=async(workspaceId:string,recieverId:string,email:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const senderInfo=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                id:true,
                firstname:true,
                lastname:true
            }
        })
        if(senderInfo?.id){
            const workspace=await client.workSpace.findUnique({
                where:{
                    id:workspaceId
                },
                select:{
                    name:true
                }
            })
            if(workspace){
                const invitation=await client.invite.create({
                    data:{
                        senderId:senderInfo.id,
                        recieverId,
                        workSpaceId:workspaceId,
                        content:`You are invite to join ${workspace.name} Workspace, click accept to confirm`
                    },
                    select:{
                        id:true
                    }
                })
                const re=await client.user.findUnique({
                    where:{
                        email:email
                    }
                })
                console.log("email---->",email)
                const notification=await client.user.update({
                    where:{
                        clerkid:user.id
                    },
                    data:{
                        notification:{
                            create:{
                                content:`${user.firstName} ${user.lastName} invited ${re?.firstname} ${re?.lastname} into ${workspace.name}`
                            }
                        }
                    }
                })
                if (invitation){
                    console.log("invitation reached")
                    const {transporter,mailOptions}=await sendEmail(email,"You got an invitation",`You are invited to join ${workspace.name} Workspace, click accept to confirm`,`<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`)
                    transporter.sendMail(mailOptions,async(error,info)=>{
                        if(error) console.log("🌋",error.message)
                        else console.log("👍 Email send",info)
                        
                    })
                    return {status:200,data:'Invite sent'}
                }
                return {status:400,data:'Invitation failed'}
            }
            return {status:404,data:'workspace not found'}
        }
        return {status:404,data:'recipient not found'}
    }catch(error){
        return {status:500,data:`Oops!something went wrong`}
    }
}
export const acceptInvite=async(inviteId:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const invitation=await client.invite.findUnique({
            where:{
                id:inviteId
            },
            select:{
                workSpaceId:true,
                reciever:{
                    select:{
                        clerkid:true
                    }
                }
            }
        })
        if(user.id!==invitation?.reciever?.clerkid) return {status:401}
        const acceptInvite= client.invite.update({
            where:{
                id:inviteId
            },
            data:{
                accepted:true
            }
        })
        const updateMember= client.user.update({
            where:{
                clerkid:user.id
            },
            data:{
                members:{
                    create:{
                        workSpaceId:invitation.workSpaceId
                    }
                }
            }
        })
        const memberTransaction=await client.$transaction(
            [acceptInvite,updateMember]
        )
        if(memberTransaction) return {status:200}
        return {status:400}
        
    }catch(error){
        return {status:500}
    }
}


