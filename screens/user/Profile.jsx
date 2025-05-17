import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Modal } from '../../features'
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  PostList,
  PostForm,
  ProfileEdit,
  AuthContext,
} from '../../components/comps';
import { useAxios } from '../../features';
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Profile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const route = useRoute();
  const { user_id } = route.params || {};
  const navigation = useNavigation();
  const api = useAxios();
  const fetchInterval = 1000 * 60 * 10;
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const my_account = user?.id === user_id;
  const userQuery = useQuery({
    queryKey: ['user', user_id],
    queryFn: () => getUser(),
    refetchInterval: fetchInterval,
  });

  const profilePictureQuery = useQuery({
    queryKey: ['user_profile_picture', user_id],
    queryFn: () => getProfilePicture(),
    refetchInterval: fetchInterval,
  });

  const friendshipQuery = useQuery({
    queryKey: ['user-friend', user_id, user?.id],
    queryFn: () => getFriendStatus(),
    refetchInterval: fetchInterval,
  });

  const followQuery = useQuery({
    queryKey: ['user-follower', user_id, user?.id],
    queryFn: () => getFollowStatus(),
    refetchInterval: fetchInterval,
  });

  const roomQuery = useQuery({
    queryKey: ['user-room', user_id, user?.id],
    queryFn: () => getRoom(),
    refetchInterval: fetchInterval,
  });

  const updateMutation = useMutation({
    mutationFn: (variables) => updateUser(variables),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(['user', user_id]);
    },
  });

  const friendshipMutation = useMutation({
    mutationFn: (variables) => befriendUser(variables),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', user_id]);
    },
  });

  const followMutation = useMutation({
    mutationFn: () => followUser(),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', user_id]);
    },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['user-post', user_id, 'infinite'],
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

  useEffect(() => {
    queryClient.invalidateQueries(['user', user_id]);
    queryClient.invalidateQueries(['user_profile_picture', user_id]);
    queryClient.invalidateQueries(['user-post', user_id, 'infinite']);
  }, [user_id, queryClient]);

  const getData = async ({ pageParam = 1 }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/content/api/post/?author_content_type=profile&author_object_id=${user_id}&page=${pageParam}`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getUser = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(`/user/api/profile/${user_id}`, config);
      return response.data;
    } catch (error) {
      console.log('Error getting profile:', error);
    }
  };

  const updateUser = async (data) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.put(
        `/user/api/profile/${user_id}/`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  const getProfilePicture = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `user/api/profile/${user_id}/current_profile_picture/`,
        config
      );
      return response.data;
    } catch (error) {
      console.log('Error getting profile:', error);
    }
  };

  const getFriendStatus = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/user/api/profile/${user_id}/friendship_status/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getRoom = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/user/api/profile/${user_id}/chat_room/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getFollowStatus = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(
        `/user/api/profile/${user_id}/follow_status/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const followUser = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.post(
        `/user/api/profile/${user_id}/follow/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const befriendUser = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.post(
        `/user/api/profile/${user_id}/send_friend_request/`,
        config
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const onClose = () => {
    setEditing((prev) => !prev);
  };

  
  if (userQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-slate-800">Loading...</Text>
      </View>
    );
  }

  const posts = data?.pages.flatMap((page) => page?.results) || [];
  
  return (
    <View className="flex-1 bg-blue-50">
      {!userQuery.error ? (
        <React.Fragment>
          {/* Cover Photo */}
          <View 
          className="relative"
          style={{height:SCREEN_HEIGHT * 0.2}}
          >
            <Image
              source={{ uri: userQuery.data?.image }}
              className="w-full h-full object-contain"
            />
          </View>
          <View 
          className="flex flex-row items-center mb-2 max-md:gap-8 gap-4"
          >
            {/* Profile Picture */}
            <View  className="w-32 h-32 p-4">
              <Image
                source={{
                  uri: profilePictureQuery.data?.picture_url || userQuery.data?.image,
                }}
                className="w-full h-full rounded-full border-4 border-white shadow-black shadow-md"
              />
            </View>

            {/* Action Buttons */}
            {my_account ? (
              <TouchableOpacity
                onPress={() => setIsMenuOpen(prev=>!prev)}
                className="bg-gray-800 p-2 rounded-lg"
              >
                <Text className="text-white text-xl">☰</Text>
              </TouchableOpacity>
            ):(
              <View 
              className="flex flex-row items-center gap-2"
              >
                {/* Follow Button */}
                {followQuery.data?.status ? (
                  <TouchableOpacity
                    disabled={followMutation.isPending}
                    onPress={() => followMutation.mutate()}
                    className="bg-red-500 py-2 px-6 rounded-full"
                  >
                    <Text className="text-white text-base font-semibold text-center">Unfollow</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={followMutation.isPending}
                    onPress={() => followMutation.mutate()}
                    className="bg-blue-500 py-2 px-6 rounded-full"
                  >
                    <Text className="text-white text-base font-semibold text-center">Follow</Text>
                  </TouchableOpacity>
                )}

                {/* Menu Button */}
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(prev=>!prev)}
                  className="bg-gray-800 p-2 rounded-lg"
                >
                  <Text className="text-white text-xl">☰</Text>
                </TouchableOpacity>
              </View>
            )}
            
          </View>

          {/* User Details */}
          <View className="flex flex-row items-baseline px-2 space-x-4">
            <View className="max-md:items-start items-center">
              <Text className="text-2xl font-bold text-slate-800">{userQuery.data?.username}</Text>
              <Text className="text-base text-gray-600 mt-1">@{userQuery.data?.username}</Text>
              <Text className="text-base text-gray-700 max-md:text-left text-center">{userQuery.data?.bio}</Text>
            </View>
            <React.Fragment>
              {my_account && (
              <TouchableOpacity onPress={onClose} className="bg-blue-400 px-4 rounded-lg">
                <Text className="text-white text-base font-semibold text-center">Edit Profile</Text>
              </TouchableOpacity>
            )}
            </React.Fragment>
          </View>

          {posts?.length > 0 && (
            <View className="flex-grow w-full" style={{minHeight:SCREEN_HEIGHT * 0.4}}>
              <PostList
                posts={posts}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                ListHeaderComponent={
                  <>
                    {/* User Posts */}
                    {my_account && (
                      <PostForm
                        author_content_type="profile"
                        author_object_id={user?.id}
                      />
                    )}
                  </>
                }
              />
            </View>
          )}
          

          {/* Menu Modal */}
          <Modal isOpen={isMenuOpen} onClose={()=>setIsMenuOpen(false)}>
            <View className="gap-2">
              {!friendshipQuery.data.isLoading && friendshipQuery.data?.status && !my_account ? (
                <TouchableOpacity
                  onPress={() => {
                    setIsMenuOpen(false);
                    navigation.navigate("DrawerHome",{screen:"chat",params:{room_id: roomQuery.data?.id }});
                  }}
                  className="p-3 bg-blue-50 rounded-lg"
                >
                  <Text className="text-base text-gray-700">Message</Text>
                </TouchableOpacity>
              ) :my_account ?(
                <View className="gap-2">
                  <TouchableOpacity
                  onPress={() => {
                    setIsMenuOpen(false);
                    navigation.navigate("DrawerHome",{screen:"friends",params:{ user_id: userQuery.data?.id }});
                  }}
                  className="p-3 bg-blue-50 rounded-lg"
                  >
                    <Text className="text-base text-gray-700">Friends</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsMenuOpen(false);
                      navigation.navigate("DrawerHome",{screen:"followers",params:{ user_id: userQuery.data?.id }});
                    }}
                    className="p-3 bg-blue-50 rounded-lg"
                  >
                    <Text className="text-base text-gray-700">Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsMenuOpen(false);
                      navigation.navigate('settings');
                    }}
                    className="p-3 bg-blue-50 rounded-lg"
                  >
                    <Text className="text-base text-gray-700">Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsMenuOpen(false);
                      logoutUser();
                    }}
                    className="p-3 bg-blue-50 rounded-lg"
                  >
                    <Text className="text-base text-gray-700">Log Out</Text>
                  </TouchableOpacity>
                </View>
              ):  (
                <View className="gap-2">
                  <TouchableOpacity
                  disabled={friendshipMutation.isPending}
                  onPress={() => {
                    friendshipMutation.mutate();
                    setIsMenuOpen(false);
                  }}
                  className="p-3 bg-blue-50 rounded-lg"
                  >
                    <Text className="text-base text-gray-700">Friend Request</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>

          {/* Edit Profile Modal */}
          <Modal isOpen={editing} onClose={onClose}>
            <ProfileEdit data={userQuery.data} update={updateMutation} />
          </Modal>
        </React.Fragment>
      ):
      (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-slate-800">Unable to fetch profile</Text>
        </View>
      )}
    </View>
  );
};


export default Profile;