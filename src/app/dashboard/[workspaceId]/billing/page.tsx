import { getPaymentInfo } from '@/actions/user'
import React from 'react'

type Props = {}

const BillingPage = async (props: Props) => {
  const payment=await getPaymentInfo()
    return (
        <div className='bg-[#1d1d1d] flex flex-col gap-y-8 p-5 rounded-xl'>
            <div>
                <h2 className='text-2xl'>Current Plan</h2>
                <p className='text-[#9d9d9d]'>Your payment History</p>
            </div>
            <div>
                <h2 className='text-2xl'>
                    ${payment?.data?.subscription?.plan==='PRO'?'99':'0'}/Month
                </h2>
                <p className='text-[#9d9d9d]'>{payment?.data?.subscription?.plan}</p>
            </div>
        </div>
  )
}

export default BillingPage