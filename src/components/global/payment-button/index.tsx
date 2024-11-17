import { Button } from '@/components/ui/button'
import React from 'react'
import Loader from '../loader'

type Props = {}

const PaymentButton = (props: Props) => {
    const {onSubscribe,isProcessing}=useSubscription()
    return (
    <Button className='text-sm w-full'>
        <Loader color="#000" state={false}>
            Upgrade
        </Loader>
    </Button>
  )
}

export default PaymentButton