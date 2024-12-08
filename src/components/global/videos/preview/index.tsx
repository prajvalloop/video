'use client'
import { getPreviewVideo, sendEmailForFirstView } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideoProps } from '@/types'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import CopyLink from '../copy-link'
import { truncateString } from '@/lib/utils'
import RichLink from '../rich-link'
import { Download } from 'lucide-react'
import TabMenu from '../../tabs'
import Aitools from '../../ai-tools'
import VideoTranscript from '../../video-transcript'
import { TabsContent } from '@/components/ui/tabs'
import Activities from '../../activities'
import EditVideo from '../editvideo'


type Props = {
    videoId:string
}

const VideoPreview = ({videoId}: Props) => {
    
    const router=useRouter()
    const {data}=useQueryData(['preview-video'],()=> getPreviewVideo(videoId))
    const noifiyFirstView=async ()=> await sendEmailForFirstView(videoId)
    const {data:video,status,author}=data as VideoProps
    if (status!==200) router.push('/')
    const daysAgo=Math.floor(
        (new Date().getTime() - video.createdAt.getTime()) / (24*60*60*1000)
    )
    useEffect(()=>{
        if(video.views===0){
            noifiyFirstView()
        }
       
    },[])
    return (
    <div className='grid grid-cols-1 xl:grid-cols-3 p-10  lg:py-10 overflow-y-auto gap-5'>
        <div className=' flex flex-col lg:col-span-2 gap-y-10'>
            <div>
                <div className='flex gap-x-5 items-start justify-between'>
                    <h2 className='text-white text-4xl font-bold'>{video.title}</h2>
                    { author ? (
                        <EditVideo videoId={videoId} title={video.title as string} description={video.description as string} />
                    ):<></>}
                    
                </div>
                <span className='flex gap-x-3 mt-2'>
                        <p className='text-[#9d9d9d] capitalize'>
                            {video.User?.firstname} {video.User?.lastname}
                        </p>
                        <p className='text-[#707070]'>
                            {daysAgo===0 ? 'Today' : `${daysAgo}d ago`}
                        </p>
                </span>
            </div>
            <video preload='metad`ata' className='w-full h-[400px] aspect-video opacity-50 rounded-xl' controls>
                <source src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`} />
            </video>
            <div className='flex flex-col text-2xl gap-y-4'>
                <div className='flex gap-x-5 items-center justify-between'>
                        <p className='text-[#bdbdbd] text-semibold'>Description</p>
                       {author?(
                        <EditVideo videoId={videoId} title={video.title as string} description={video.description as string}></EditVideo>
                       ):<></>}
                </div>
                <p className='text-[#9d9d9d] text-medium'>
                    {video.description}
                </p>
            </div>
        </div>
        <div className='lg:col-span-1 flex flex-col gap-y-16'>
            <div className='flex justify-end gap-x-3 items-center'>
                <CopyLink variant={"outline"} className='rounded-full bg-transparent px-10' videoId={videoId} />
                <RichLink
                    description={truncateString(video.description as string,150)}
                    id={videoId}
                    source={video.source}
                    title={video.title as string}
                />
                <Download/>
            </div>
            <div>
                <TabMenu defaultValue='Transcript' triggers={["Transcript","Activity"]}>
                            <Aitools videoId={videoId} trial={video.User?.trial!} plan={video.User?.subscription?.plan!} />
                            <VideoTranscript transcript={video.description!} />
                            {/* <TabsContent value="Activity">
                                Make changes to your account here.
                            </TabsContent> */}
                            <Activities author={video.User?.firstname as string} videoId={videoId}/>
                </TabMenu>
            </div>
        </div>
    </div>
  )
}
export default VideoPreview