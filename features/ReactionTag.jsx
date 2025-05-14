import React from 'react'
import { Text, TouchableOpacity } from 'react-native';

const ReactionTag = () => {
    const [showReactions, setShowReactions] = useState(false);
    const [reaction, setReaction] = useState(null);
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    return (
        <TouchableOpacity>
            <Text className="text-blue-500">👍 100 Like</Text>
        </TouchableOpacity>
    )
}

export default ReactionTag