import VideoRecorderIcon from '@/components/icons/video-recorder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'
import { Download, Search, UploadIcon } from 'lucide-react'
import React from 'react'


const InfoBar = () => {
  console.log('env->',`${process.env.NEXT_PUBLIC_SETUP_DOWNLOAD}`)
    return (
    <header className='pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-end gap-4'>
        {/* <div className='  flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg'>
            <Search size={25} className='text-[#707070]' />
            <Input className='bg-transparent border-none' placeholder='Search for people,projects & folders'></Input>
        </div> */}
        <div className='flex items-center gap-4'>
            {/* <Button className='bg-[#9D9D9D]'>
                <UploadIcon size={20}/>
                <span>Upload</span>
            </Button>
            <Button className='bg-[#9D9D9D]'>
               <VideoRecorderIcon/>
                <span>Record</span>
            </Button> */}
            <a href={`${process.env.NEXT_PUBLIC_SETUP_DOWNLOAD}`}>
            <Button  className='bg-[#9D9D9D]'>
                <Download size={20}/>
                <span>Setup</span>
            </Button>
            </a>
            <UserButton/>

        </div>
    </header>
    
  )
}

export default InfoBar