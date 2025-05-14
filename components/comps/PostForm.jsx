import React, { useState } from 'react';
import { useAxios } from '.';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View, Text } from 'react-native';
import ImageInputField from '../ImageInputField';
import { Formik } from 'formik';
import { Feather } from '@expo/vector-icons';

const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
    files: Yup.array().of(Yup.mixed().required("File is required"))
});

const PostForm = ({ author_content_type, author_object_id }) => {
    const [scheduled, setScheduled] = useState("");
    const [file, setFile] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState(null);
    const api = useAxios();
    const queryClient = useQueryClient();
    const initialValues = {content:"",files:[]};

    const postMutation = useMutation({
        mutationFn: ()=> postData(),
        onSuccess : ()=> {
            setFile([]);
            queryClient.invalidateQueries(['feed']);
        },
    });

    const validate = (values) => {
        const errors = {};
        if (!values.content || !file) {
            errors.content = 'Required';
        }
        return errors;
    };

    // Handle post data
    const postData = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        try {
            const response = await api.post(
                `/content/api/post/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        };
    };

    const handleSubmit = (values, setSubmitting) => {
        const formData = new FormData()
        formData.append("content",values.content);
        formData.append("author_content_type",author_content_type);
        formData.append("author_object_id",author_object_id);
        formData.append("scheduled_time",scheduled)
        file?.forEach((file)=>{
            'media', {
                uri: file.files[0].uri,
                name: file.files[0].fileName,
                type: file.files[0].mimeType,
            }
        });
        postMutation.mutate(formData);
        setSubmitting(false);
    };
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    };

    return (
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validate={values => validate(values)}
        onSubmit={submit}
        >
            {({
                values,
                errors,
                touched,
                setFieldValue,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            })=>(
                <KeyboardAvoidingView className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <View className="flex flex-row">
                        <TextInput
                            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What's on your mind?"
                            inputMode="text"
                            multiline={true}
                            onChangeText={handleChange('content')}
                            onBlur={handleBlur('content')}
                            value={values.content}
                        ></TextInput>
                        <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting||postMutation.isPending}
                        className="bg-blue-500 justify-center px-4 rounded-md"
                        >
                            <Feather name="send" size={24} color={"#fff"} />
                        </TouchableOpacity>
                    </View>
    
                    <View className="mt-4">
                        <View>
                            <View className="flex justify-between">
                            </View>
                            <View className="relative">
                                <ImageInputField setFieldValue={setFieldValue} file={file} setPermissionStatus={setPermissionStatus} permissionStatus={permissionStatus} setFile={setFile} />
                                {errors.files && touched.files && (
                                    <View className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3 ml-80">
                                        <Ionicons name="alert-circle-outline" color={"red"} size={24} />
                                    </View>
                                )}
                            </View>
                            {errors.files && touched.files && (
                                <Text className="text-xs text-red-600 mt-2">{errors.files}</Text>
                            )}
                        </View>
                    </View>
    
                    
                </KeyboardAvoidingView>
            )}
        </Formik>
    )
}

export default PostForm