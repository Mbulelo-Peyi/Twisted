import React, { useContext, useState } from 'react';
import { Modal } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../utils/useAxios';
import AuthContext from '../../context/AuthContext';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const DeleteAccount = () => {
    const { logoutUser } = useContext(AuthContext);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const queryClient = useQueryClient();
    const api = useAxios();
    const deleteAccountMutation = useMutation({
        mutationFn: async (password) => {
            const response = await api.post('/api/profile/delete_account/', { password });
            return response.data;
        },
        onSuccess: () => {
            queryClient.removeQueries(['user']);
            logoutUser();
            toggleDeleteAccountModal();
        },
        onError: (error) => {
            console.error("Error deleting account:", error.response?.data || error.message);
            alert("Failed to delete account. Please check your password.");
        },
    });

    const toggleDeleteAccountModal = () => {
        setDeleteAccountModalOpen((prev) => !prev);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate(password);
    };

    return (
        <SafeAreaView className="relative">
            <View className="w-full py-16 flex flex-col gap-6 items-center px-4">
                <Text className="text-center font-medium text-red-800 bg-red-100 p-4 rounded-lg shadow">
                    Warning: Deleting your account is irreversible. All your data will be permanently deleted.
                </Text>
                <TouchableOpacity
                    className="px-6 py-3 bg-blue-700 rounded-full shadow"
                    onPress={() => alert("Feature coming soon!")}
                >
                    <Text className="text-white font-semibold">Take a Break</Text>
                </TouchableOpacity>
            </View>

            <View className="mt-9 pt-5 grid grid-cols-2 divide-x divide-gray-300 bg-gray-50 rounded-lg shadow">
                <TouchableOpacity
                className="flex flex-row items-center justify-center gap-x-2.5 p-4"
                >
                    <AntDesign name="home" size={20} />
                    <Text className="font-semibold text-gray-900">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={toggleDeleteAccountModal}
                    className="flex flex-row items-center justify-center gap-x-2.5 p-4"
                >
                    <AntDesign name="deleteuser" size={20} />
                    <Text className="font-semibold text-red-600">Delete Account</Text>
                </TouchableOpacity>
            </View>

            {/* Delete Account Modal */}
            <Modal isOpen={deleteAccountModalOpen} onClose={toggleDeleteAccountModal} withInput={true}>
                <View className="text-center w-full max-w-sm mx-auto">
                    <AntDesign name="deleteuser" size={56} className="mx-auto text-red-600" />
                    <Text className="text-lg font-bold text-gray-900 mt-4">Confirm Account Deletion</Text>
                    <Text className="text-sm text-gray-600 mt-2">
                        Please enter your password to confirm account deletion.
                    </Text>

                    <View className="relative mt-4">
                        <TextInput
                            secureTextEntry={showPassword}
                            inputMode='text'
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(e) => setPassword(e)}
                        />
                        <TouchableOpacity
                            className="absolute inset-y-0 right-3 flex items-center"
                            onPress={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <AntDesign name="eyeo" size={20} className="text-gray-500" />
                            ) : (
                                <AntDesign name="eye" size={20} className="text-gray-500" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex justify-center gap-4 mt-6">
                        <TouchableOpacity
                        onPress={handleDeleteAccount}
                        disabled={deleteAccountMutation.isPending}
                        className="w-full px-4 py-2 bg-red-600 rounded-lg shadow disabled:opacity-50 transition"
                        >
                            <Text className="text-white font-semibold">{deleteAccountMutation.isPending ? "Deleting..." : "Delete"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={toggleDeleteAccountModal}
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg shadow"
                        >
                            <Text className="text-gray-600 font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default DeleteAccount;
