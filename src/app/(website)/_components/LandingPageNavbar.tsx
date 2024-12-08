import { Button } from '@/components/ui/button'
import { Menu, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const LandingPageNavbar = () => {
  return (
    <div className=' w-full flex justify-between items-center'>
        <div className='flex text-3xl font-semibold items-center gap-x-3'>
            {/* <Menu className='w-6 h-6' /> */}
            
            <Image className='text-white' src='/opal-logo.svg' alt='logo' width={42} height={42} />
            Recordify
        </div>
        {/* <div className='hidden lg:flex gap-x-3 items-center'>
        <Link
          href="/"
          className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80"
        >
          Home </Link>
            <Link href={'/'}>Pricing</Link>
            <Link href={'/'}>Contact</Link>
        </div> */}
        <Link href={'/auth/sign-in'}>
            
            <Button className='flex items-center gap-x-2'>
                <User fill='#000'></User>
                Login
            </Button>
        </Link>
        
       
        
        </div>
  )
}

export default LandingPageNavbar