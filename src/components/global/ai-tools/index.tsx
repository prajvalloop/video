import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import Loader from '../loader'
import VideoRecorderDuotone from '@/components/icons/video-recorder-dutone'
import { DownloadIcon } from 'lucide-react'
import { FileDuoToneBlack } from '@/components/icons/file-duotone-black'

type Props = {
    plan:'PRO'|'FREE',
    trial:boolean,
    videoId:string
}

const Aitools = ({plan,trial,videoId}: Props) => {
  //WIP setup with ai
    return (
    <TabsContent value="Ai tools">
        <div className='flex items-center'>
            <div className='w-8/12'>
            <h2 className='text-3xl font-bold'>Ai tools</h2>
            <p className='text-[#bdbdbd]'>
                Taking your videos to the next <br/> step with the prower of AI!
            </p>
            </div>
            <div className='flex items-center gap-x-2'>
            <Button className='mt-2 text-sm'>
                <Loader state={false} color="#000">Try now</Loader>
           </Button>
           {/* {pay} */}
           <Button className=' mt-2 text-sm' variant={'secondary'}>
                <Loader state={false} color="#000">Pay Now</Loader>
           </Button>
           <Button className=' mt-2 text-sm' variant={'secondary'}>
                <Loader state={false} color="#000">Generate Now</Loader>
           </Button>
           
            </div>
            </div>
            <div className='flex justify-between'>
                <div className='flex flex-col items-center text-center text-[#bdbdbd] gap-y-2 text-sm'>
                    <VideoRecorderDuotone width='36' height='36'/>
                    Generate video
                </div>
                <div className='flex flex-col items-center text-center text-[#bdbdbd] gap-y-2 text-sm'>
                    <FileDuoToneBlack/>
                    Create and Read Video <br/> Transcripts
                </div>
                <div className='flex flex-col items-center text-center text-[#bdbdbd] gap-y-2 text-sm'>
                    <DownloadIcon/>
                    Download Video
                </div>
                
            </div>
            
           
        
    </TabsContent>
  )
}

export default Aitools