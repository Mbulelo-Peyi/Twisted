import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import useWebSocket from '../../utils/useWebSocket';
import { useAxios } from '../../features';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../user';

const Chat = () => {
  const { params:{room_id} } = useRoute();
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, isConnected } = useWebSocket(1, user?.id);
  const [message, setMessage] = useState('');
  const api = useAxios();
  const queryClient = useQueryClient();

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage(''); // Clear input field after sending
      return message;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['chat', room_id, 'infinite'],
    getNextPageParam: (lastPage) => {
      try {
        const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
        return nextPage;
      } catch (error) {
        return null;
      }
    },
    queryFn: (pageParam) => getData(pageParam),
  });

  const roomQuery = useQuery({
    queryKey: ['room', room_id],
    queryFn: () => getChatRoom(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: () => handleSendMessage(),
    onSuccess: () => {},
  });

  const getData = async ({ pageParam = 1 }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/user/api/chat/${room_id}/?page=${pageParam}`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getChatRoom = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/user/api/chatrooms/${room_id}/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries(['chat', 1, 'infinite']);
  }, [messages, queryClient, room_id]);

  const chats = data?.pages.flatMap((page) => page?.results) || [];

  const renderMessage = ({ item: message }) => {
    const isUserMessage = user?.id === message?.sender?.id;
    return (
      <View
        className={`flex-row my-2 px-2 ${isUserMessage?"flex-row-reverse justify-start":"justify-start"}`}
      >
        <Image
          source={{
            uri:
              message?.sender?.profile_pic?.length > 0
                ? message?.sender?.profile_pic?.filter((pic) => pic.is_active)[0]
                    ?.picture
                : message?.sender?.image,
          }}
          className="w-10 h-10 rounded-3xl my-2"
        />
        <View className="bg-blue-50 p-3 max-w-[70%] shadow-sm">
          {message?.content && (
            <Text className="text-base text-slate-800">{message?.content}</Text>
          )}
          <Text className="text-base text-gray-400 mt-1">
            Sent at: {message?.timesince}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <Text className="font-bold text-xl mb-2">{roomQuery.data?.name}</Text>
      <Text className="text-base mb-4">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </Text>
      <FlatList
        data={chats}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        inverted // New messages appear at the bottom
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <Text className="text-base text-gray-500 text-center mt-5">
            No messages yet. Start the conversation!
          </Text>
        }
        className="flex-1 mb-4"
      />
      <View className="flex-row justify-center items-center mb-5 py-2 bottom-5">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 border border-blue-50 bg-gradient-to-t rounded-lg p-3 text-base mr-2"
        />
        <TouchableOpacity
          disabled={sendMessageMutation.isPending}
          onPress={() => sendMessageMutation.mutate()}
          className={`bg-blue-600/100 py-3 px-4 rounded-lg ${sendMessageMutation.isPending && ("bg-blue-400")}`}
        >
          <Text className="text-white text-base font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default Chat;