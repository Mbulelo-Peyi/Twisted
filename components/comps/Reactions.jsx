import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '.';
import { Text, TouchableOpacity, View } from 'react-native';

const reactionsList = [
  { icon: '👍', name: 'like' },
  { icon: '❤️', name: 'love' },
  { icon: '😂', name: 'haha' },
  { icon: '😢', name: 'sad' },
  { icon: '😮', name: 'angry' },
];

const Reactions = ({ postQuery, detail }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState(null);
  const api = useAxios();
  const queryClient = useQueryClient();
  const fetchInterval = 1000 * 60 * 10;

  const reactionQuery = useQuery({
    queryKey: ['reaction', postQuery?.id],
    queryFn: () => getReaction(),
    refetchInterval: fetchInterval,
  });

  const reactionCountQuery = useQuery({
    queryKey: ['reaction-count', postQuery?.id],
    queryFn: () => getReactionCount(),
    refetchInterval: fetchInterval,
  });

  const reactionMutation = useMutation({
    mutationFn: (variables) => handleReaction(variables),
    onSuccess: () => {
      setShowReactions((prev) => !prev);
      if (detail) {
        queryClient.invalidateQueries(['post', postQuery?.id]);
        queryClient.invalidateQueries(['reaction', postQuery?.id]);
      }
      queryClient.invalidateQueries(['reaction-count', postQuery?.id]);
      console.log('Reaction updated, showReactions:', !showReactions);
    },
    onError: (error) => {
      console.error('Reaction mutation error:', error);
      alert('Failed to update reaction. Please try again.');
    },
  });

  const getReaction = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/content/api/posts/${postQuery?.id}/check_reaction/`,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Get reaction error:', error);
      return error;
    }
  };

  const getReactionCount = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/content/api/posts/${postQuery?.id}/reaction_count/`,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Get reaction count error:', error);
      return error;
    }
  };

  const handleReaction = async (reaction) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.post(
        reactionQuery.data?.reaction_type === reaction?.name
          ? `/content/api/posts/${postQuery?.id}/delete_reaction/`
          : `/content/api/posts/${postQuery?.id}/reaction/`,
        {
          reaction_type: reaction?.name,
        },
        config
      );
      const reactions = reactionsList.filter(
        (obj) => obj.name === response.data?.reaction_type
      );
      setReaction(reactions?.length > 0 ? reactions[0] : reactionsList[0]);
      return response.data;
    } catch (error) {
      console.error('Handle reaction error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const reactions = reactionsList.filter(
      (obj) => obj.name === reactionQuery.data?.reaction_type
    );
    setReaction(
      reactions?.length > 0 ? reactions[0].icon : reactionsList[0].icon
    );
  }, [reactionQuery.data]);

  return (
    <View className="relative w-20 h-10 flex items-center justify-center mt-4">
      {!reactionQuery.isLoading && !reactionCountQuery.isLoading &&(
        <View className="flex flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={() => setShowReactions(!showReactions)}
            className="bg-blue-50 px-2 rounded-full h-8 flex items-center justify-center"
          >
            <Text className="text-lg">
              {reaction?.icon ? reaction?.icon : reaction}
            </Text>
          </TouchableOpacity>
          <Text className="bg-gray-100 px-2 py-1 rounded-full text-sm">
            {reactionCountQuery.data?.reaction_count || 0}
          </Text>
        </View>
      )}
      {showReactions && (
        <View className="absolute top-10 left-0 flex flex-row bg-blue-100 items-baseline rounded-3xl shadow z-10">
          {reactionsList.map((reaction, index) => (
            <TouchableOpacity
              key={index}
              disabled={reactionMutation.isPending}
              onPress={() => reactionMutation.mutate(reaction)}
              className="bg-inherit rounded-full px-2"
            >
              <Text className="text-lg">{reaction.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Reactions;