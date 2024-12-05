'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Key, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import axios from "axios"
type Props = {
    params: { token: string }
  }


const page = ({params}: Props) => {
  const [password,setPassword]=useState<string | null>(null)
  const [confirmPassword,setConfirmPassword]=useState<string | null>(null)
  const handleSubmit=async()=>{
    console.log('password->',password)
    console.log('confirmpassword->',password)
    if (!password || !confirmPassword || password!==confirmPassword){
        toast('Failed',{
            description:'Password should be equal to confirm password'
        })
    }
    else{
    const res:{
        data:{
            status:number,
            data:string
        }
    }=await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/reset-password`,{
        token:params.token,
        password:password,
        
    })
    toast(res.data.status===200 ? 'Success':'Failed',{
        description:res.data.data
    })
    
    
}
  }
    return (
       
        <div className="h-screen flex flex-col items-center  gap-y-2">
            <div className='h-full flex items-center'>
                <div className='flex flex-col items-center gap-y-2'>
        <div className='flex gap-x-5 justify-center items-center'>
        <Key
            fill="#575655"
            color="#575655"
            size={36}
        />
        <Input  className=" text-white border border-gray-300 rounded-md focus:outline-none"  type="password" placeholder="password"  onChange={(e)=>setPassword(e.target.value)} />
    </div>
    <div className='flex gap-x-5 justify-center items-center'>
        <Lock
            fill="#575655"
            color="#575655"
            size={36}
        />
        <Input className=" text-white border border-gray-300 rounded-md focus:outline-none" type="password" placeholder="Confirm Password"  onChange={(e)=>setConfirmPassword(e.target.value)} />
    </div>
    

       
      
        <Button  variant={'default'}  onClick={handleSubmit}>Reset Password</Button>
    
       
        
        
        
    </div>
    </div>
    </div>
    
  )
}

export default page