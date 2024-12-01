"use server"

import { client } from "@/lib/prisma"
import { WorkspaceProps } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import { sendEmail } from "./user"
import {createClient,OAuthStrategy}  from "@wix/sdk"
import {items} from '@wix/data'

export const verifyAccessToWorkspace=async(workspaceId:string)=>{
    try{
        const user= await currentUser()
        if(!user) return {status:403}
        const isUserinworkspace=await client.workSpace.findUnique({
            where:{
                id:workspaceId,
                OR:[{
                    User:{
                        clerkid:user.id
                    }
                },
            {
               members:{
                every:{
                    User:{
                        clerkid:user.id
                    }
                }
               } 
            }]
            }
        })
        return {status:200,data:{workspace:isUserinworkspace}}
        
    }catch(error){
        return {status:403,data:{workspace:null}}
    }
}
export const getWorkspaceFolders=async(workspaceId:string)=>{
    try{
        const isFolders=await client.folder.findMany({
            where:{
                workSpaceId:workspaceId
            },
            include:{
                _count:{
                    select:{
                        videos:true
                    }
                }
            }

        })
        if(isFolders && isFolders.length>0){
            return {status:200,data:isFolders}
        }
        return {status:404,data:[]}
    }catch(error){
        return {status:403,data:[]}
    }
}
export const getAllUserVideos=async(workspaceId:string)=>{
    try{
        const videos=await client.video.findMany({
            where:{
                OR:[{workSpaceId:workspaceId},{folderId:workspaceId}]
            },
            select:{
                id:true,
                title:true,
                createdAt:true,
                source:true,
                processing:true,
                Folder:{
                    select:{
                        id:true,
                        name:true
                    }
                },User:{
                    select:{
                        firstname:true,
                        lastname:true,
                        image:true
                    }
                }
            },
            orderBy:{
                createdAt:'asc'
            }
        })
        if(videos&&videos.length>0) return {status:200,data:videos}
        return {status:404,data:[]}
    }
    catch(error){
        return {status:500,data:[]}
    }
}
export const getWorkspaces = async () => {
    try {
      const user = await currentUser()
  
      if (!user) return { status: 404 }
  
    //   const workspaces = await client.user.findUnique({
    //     where: {
    //       clerkid: user.id,
    //     },
    //     select: {
    //       subscription: {
    //         select: {
    //           plan: true,
    //         },
    //       },
    //       workspace: {
    //         select: {
    //           id: true,
    //           name: true,
    //           type: true,
    //         },
    //       },
    //       members: {
    //         select: {
    //           WorkSpace: {
    //             select: {
    //               id: true,
    //               name: true,
    //               type: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   })
    const result = await client.$transaction(async (prisma) => {
        const userData = await prisma.user.findUnique({
            where: { clerkid: user.id },
            select: {
                subscription: { select: { plan: true } },
            }
        })

        const userWorkspaces = await prisma.workSpace.findMany({
            where: { User: { clerkid: user.id } },
            select: {
                id: true,
                name: true,
                type: true,
            }
        })

        const memberWorkspaces = await prisma.workSpace.findMany({
            where: { members: { some: { User: { clerkid: user.id } } } },
            select: {
                id: true,
                name: true,
                type: true,
            }
        })

        return { userData, userWorkspaces, memberWorkspaces }
    })
  
      if (result) {
        // Convert enums to strings if necessary
        const formattedData = {
            data: {
                subscription: result.userData?.subscription 
                    ? { plan: result.userData.subscription.plan as 'FREE' | 'PRO' }
                    : null,
                workspace: result.userWorkspaces.map(w => ({
                    id: w.id,
                    name: w.name,
                    type: w.type as 'PUBLIC' | 'PERSONAL'
                })),
                members: result.memberWorkspaces.map(w => ({
                    WorkSpace: {
                        id: w.id,
                        name: w.name,
                        type: w.type as 'PUBLIC' | 'PERSONAL'
                    }
                }))
            }
        }

       return formattedData
        
        
    }
    return {status:404,data:[]}
    
    } catch (error) {
        return { status: 500, data: [] };
    }
  }
// Helper function to recursively convert enums to strings



// Helper function to check if a value is an enum


export const getNotifications=async()=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const notifications=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                notification:true,
                _count:{
                    select:{
                        notification:true
                    }
                }
            }
        })
        if(notifications && notifications.notification.length>0) return {status:200,data:notifications}
        return {status:404,data:[]}
    }catch(error){
        return {status:500,data:[]}
    }
}

export const createWorkspace=async (name:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const authorized=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                subscription:{
                    select:{
                        plan:true
                    }
                }
            }
        })
        if (authorized?.subscription?.plan==='PRO'){
            const workspace=await client.user.update({
                where:{
                    clerkid:user.id
                },
                data:{
                    workspace:{
                        create:{
                            name,
                            type:'PUBLIC'
                        }
                    }
                }
            })
            if(workspace) return {status:201,data:"Workspace created"}
        }
        console.log("pro plann")
        return {status:401,data:'You are not authorized to create a workspace'}
    }catch(error){
        return {status:500,data:'Error'}
    }
}
export const renamedFolders=async(folderId:string,name:string)=>{
    try{
        const folder=await client.folder.update({
            where:{
                id:folderId
            },
            data:{
                name
            }
        })
        if(folder){
            return {status:200,data:'Folder renamed'}

        }
        return {status:400,data:'Folder does not exist'}

    }catch(error){
        return {status:500,data:'Something went wrong'}
    }
}

export const createFolder=async(workSpaceId:string)=>{
    try{
        const isNewFolder=await client.workSpace.update({
            where:{
                id:workSpaceId
            },
            data:{
                folders:{
                    create:{name:"Untitled"}
                }
            }
        })
        if (isNewFolder){
            return {status:200,message:'New Folder Created'}
        }
        return {status:400,message:'Could not create folder'}
    } catch(error){
        return {status:500,message:'Oops something went wrong'}
    }
}
export const getFolderInfo=async(folderId:string)=>{
    try{
        const folder=await client.folder.findUnique({
            where:{
                id:folderId
            },
            select:{
                name:true,
                _count:{
                    select:{
                        videos:true
                    }
                }
            }
        })
        if (folder) return {status:200,data:folder}
        return {status:200,data:null}
    }catch(error){
        return {status:500,data:null}
    }
}
export const moveVideoLoaction=async(videoId:string,workSpaceId:string,folderId:string)=>{
    try{
       const location=await client.video.update({
        where:{
            id:videoId
        },
        data:{
            folderId:folderId || null,
            workSpaceId:workSpaceId
        }
       })
    if (location) return {status:200,data:'Folder changed successfully'}
    return {status:404,data:'workspace/folder not found'}
    }catch(error){
        return {status:500,data:'Oops something went wrong'}
    }
}
export const getPreviewVideo=async(videoId:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const video = await client.video.findUnique({
            where: {
              id: videoId,
            },
            select: {
              title: true,
              createdAt: true,
              source: true,
              description: true,
              processing: true,
              views: true,
              summery: true,
              User: {
                select: {
                  firstname: true,
                  lastname: true,
                  image: true,
                  clerkid: true,
                  trial: true,
                  subscription: {
                    select: {
                      plan: true,
                    },
                  },
                },
              },
            },
          })
          if (video){
            return {
                status:200,
                data:video,
                author:user.id===video.User?.clerkid? true:false
            }
          }
          return {status:404}
    }catch(error){
        return {status:500}
    }
}
export const sendEmailForFirstView=async(videoId:string)=>{
    try{
        const user=await currentUser()
        if(!user) return {status:404}
        const firstViewSettings=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                firstView:true
            }
        })
        if(!firstViewSettings?.firstView) return 
        const video=await client.video.findUnique({
            where:{
                id:videoId
            },
            select:{
                title:true,
                views:true,
                User:{
                    select:{
                        email:true,
                        clerkid:true
                    }
                }
            }
        })
        if(video && video.views===0){
            await client.video.update({
                where:{
                    id:videoId
                },
                data:{
                    views:video.views+1
                }
            })
        }
        if(!video) return 
        const {transporter,mailOptions}= await sendEmail(
            video?.User?.email!,
            'You got a viewer',
            `Your video ${video.title} just got its first viewer`
        )
            transporter.sendMail(mailOptions,async(error,info)=>{
                if(error) console.log(error.message)
                else{
                    const notification=await client.user.update({
                        where:{clerkid:video.User?.clerkid},
                        data:{
                            notification:{
                                create:{
                                    content:mailOptions.text
                                }
                            }
                        }
                    })
                    if(notification) return {status:200}
                    }
            })

    }
    catch(error){
        console.log("error->",error)
    }
}
export const editVideoInfo=async(videoId:string,title:string,description:string)=>{
    try{
        const video=await client.video.update({
            where:{
                id:videoId
            },data:{
                title,
                description
            }
        })
        if(video) return {status:200,data:'Video successfully updated'}
        return {status:404,data:'Video not found'}
    }catch(error){
        return {status:400}
    }
}
export const getWixContent=async()=>{
    try{
        const myWixClient=createClient({
            modules:{items},
            auth:OAuthStrategy({
                clientId:process.env.WIX_OAUTH_KEY as string
            })
        })
        const videos=await myWixClient.items.queryDataItems({dataCollectionId:'Prajval-video'}).find()
        const videoId=videos.items.map(v=>v.data?.id)
        const video=await client.video.findMany({
            where:{
                id:{
                    in:videoId
                }
            },
            select:{
                id:true,
                createdAt:true,
                title:true,
                source:true,
                processing:true,
                workSpaceId:true,
                User:{
                    select:{
                        firstname:true,
                        lastname:true,
                        image:true
                    }
                },
                Folder:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        if(video && video.length>0){
            return {status:200,data:video}
        }
        return {status:404}
    }catch(error){
        console.log(error)
        return {status:400}
    }
}

export const howToPost=async()=>{
    try{
        const response:any=await axios.get(process.env.CLOUD_WAYS_POST as string)
        if (response.data){
            return {
                title:response.data[0].title.rendered,
                content:response.data[0].content.rendered
            }
        }
    }catch(error){
        return {status:400}
    }
}