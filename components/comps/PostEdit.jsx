import React, { useContext } from "react";
import { AuthContext, useAxios } from "./";
import { Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const PostEdit = ({ post, onClose }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const initialValues = { 
        content: post?.content, 
        scheduled_time: post?.scheduled_time,
        author_content_type: post?.author_content_type,
        author_object_id: post?.author_object_id,
    };
    const validate = (values) => {
        const errors = {};
        if (!values.content) {
            errors.content = 'Required';
        }
        if (!values.scheduled_time) {
            errors.scheduled_time = 'Required';
        }
        return errors;
    };
    const updatePostMutation = useMutation({
            mutationFn: (variables)=> updatePost(variables),
            onSuccess: (data)=> {
                onClose();
                queryClient.invalidateQueries(['post-permissions', post?.id])
            }
    });

    const deletePostMutation = useMutation({
        mutationFn: ()=> deletePost(),
        onSuccess: (data)=> {
            onClose();
            // navigation.navigate(`/profile/${user?.id}/`)
            queryClient.removeQueries(['post-permissions', post?.id])
        }
    });

    const updatePost = async (data) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.put(
                `/content/api/post/${post?.id}/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    };

    const deletePost = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.delete(
                `/content/api/post/${post?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    };

    // const handleSubmit = (values, setSubmitting) => {
    //     updatePostMutation.mutate(values)
    //     setSubmitting(false);
    // }

    const handleSubmit = (values, { setSubmitting }) => {
        updatePostMutation.mutate(values, {
            onSettled: () => {
                setSubmitting(false);
            },
        });
    };
      
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }
    return (
        <Formik
        initialValues={initialValues}
        validate={values => validate(values)}
        onSubmit={submit}
        >
        {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        }) => (
            <KeyboardAvoidingView>
                <View className="grid gap-y-4">
                    <View>
                        <View className="flex justify-between items-center">
                            <Text className="block text-sm mb-2 dark:text-white">Content</Text>
                        </View>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            inputMode="text" 
                            placeholder=""
                            onChange={handleChange("content")}
                            onBlur={handleBlur("content")}
                            value={values.content}
                            ></TextInput>
                            {errors.content && touched.content && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.content && touched.content && (
                            <Text className="text-xs text-red-600 mt-2" id="content-error">{errors.content}</Text>
                        )}
                    </View>
                        <View className="flex flex-row space-x-2">
                            <TouchableOpacity 
                            onPress={handleSubmit} 
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||updatePostMutation.isPending||deletePostMutation.isPending}
                            >
                                <Text className="text-white text-sm font-semibold">update post</Text></TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>deletePostMutation.mutate()} 
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2  rounded-lg border border-transparent bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||updatePostMutation.isPending||deletePostMutation.isPending}
                            >
                                <Text className="text-white text-sm font-semibold">delete</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </KeyboardAvoidingView>
        )}
        </Formik>
    )
}

export default PostEdit
