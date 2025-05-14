import React from 'react';
import { CommentReply, CommentOptions, CommentButtons } from '.';
import { View } from 'react-native';

const CommentCard = ({ comment }) => {
    
    return (
        <View
            className="bg-gray-100 p-4 rounded-lg mb-2 text-gray-700 flex flex-col"
        >
            <CommentOptions comment={comment} />
            <CommentButtons comment={comment} />
            <CommentReply comment={comment} />
        </View>
    )
}

export default CommentCard