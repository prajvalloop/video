import { getWixContent } from '@/actions/workspace'
import VideoCard from '@/components/global/videos/video-card'
import React from 'react'



const Home = async() => {
    const videos=await getWixContent()
    // const post=await howToPost()
    console.log("videeeeee->",videos)
    return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {videos.status===200 ? videos.data?.map((video)=><VideoCard key={video.id} {...video} workspaceId={video.workSpaceId!} />):''}
    </div>
  )
}

export default Home