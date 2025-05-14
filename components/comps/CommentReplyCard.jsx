import React from 'react';
import { CommentReplyOptions, CommentReplyButtons } from '.';
import { View } from 'react-native';


const CommentReplyCard = ({ commentReply }) => {
    

    return (
        <View
            className="bg-gray-100 p-4 rounded-lg mb-2 text-gray-700 flex flex-col"
        >
            <CommentReplyOptions commentReply={commentReply} />
            <CommentReplyButtons commentReply={commentReply} />
        </View>
    )
}

export default CommentReplyCard