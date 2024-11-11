'use client'
import { getAllUserVideos } from '@/actions/workspace'
import VideoRecorderDuotone from '@/components/icons/video-recorder-dutone'
import { useQueryData } from '@/hooks/useQueryData'
import { cn } from '@/lib/utils'
import { VideoProps, VideosProps } from '@/types'
import React from 'react'
import VideoCard from './video-card'

type Props = {
    folderId:string,
    videosKey:string,
    workspaceId:string
}
// const video=

//   {
//       User: {
//           firstname: "John",
//           lastname: "Doe",
//           image: "https://example.com/user-image.jpg"
//       },
//       id: "video_12345",
//       processing: false,
//       Folder: {
//           id: "folder_67890",
//           name: "Tutorials"
//       },
//       createdAt: new Date("2024-11-10T10:30:00Z"),
//       title: "Introduction to Gemini",
//       source: "https://example.com/video-source.mp4"
//   }



const Videos = ({folderId,videosKey,workspaceId}: Props) => {
  //wip add vidoes logic
    const {data:videoData}=useQueryData([videosKey],()=>getAllUserVideos(folderId))
  const {status:videosStatus,data:videos}=videoData as VideosProps
    return (
    <div className='flex flex-col gap-4 mt-4'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <VideoRecorderDuotone/>
                <h2 className='text-[#bdbdbd]'>Videos</h2>
            </div>
        </div>
        <section className={cn(videosStatus!==200?'p-5':'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
            {videosStatus===200 ? videos.map((video)=><VideoCard key={video.id} workspaceId={workspaceId} {...video}   />) : <p className='text-[#bdbdbd]'>No videos in Workspace</p>}
            {/* <VideoCard workspaceId={workspaceId} {...video}/> */}
        </section>
    </div>
  )
}

export default Videos