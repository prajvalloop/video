"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Loader from '../loader'
import { useSubscription } from '@/hooks/useSubscription'
import Script from 'next/script'

type Props = {}

const PaymentButton = (props: Props) => {
    const {onSubscribe,isProcessing}=useSubscription()
    return (
    <Button className='text-sm w-full' onClick={onSubscribe}>
        <Script type='text/javascript' src="https://checkout.razorpay.com/v1/checkout.js" />
        <Loader color="#000" state={isProcessing}>
            Upgrade
        </Loader>
    </Button>
  )
}

export default PaymentButton