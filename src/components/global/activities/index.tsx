import CommentForm from '@/components/forms/comment-form'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import CommentCard from '../comment-card'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import { VideoCommentProps } from '@/types'

type Props = {
    author:string,
    videoId:string
}

const Activities = ({author,videoId}: Props) => {
    const {data}=useQueryData(['video-comments'],()=> getVideoComments(videoId))
    const {data:comments}=data as VideoCommentProps
    console.log('commensts->',comments)
    return (
    <TabsContent value="Activity" >
        <CommentForm author={author} videoId={videoId}/>
        {comments.map((comment)=>
            <CommentCard 
            comment={comment.comment}
            key={comment.id}
            author={{
            image: comment.User?.image!,
            firstname: comment.User?.firstname!,
            lastname: comment.User?.lastname!,
            }}
            videoId={videoId}
            reply={comment.reply}
            commentId={comment.id}
            
    />
        )}
    </TabsContent>
  )
}

export default Activities