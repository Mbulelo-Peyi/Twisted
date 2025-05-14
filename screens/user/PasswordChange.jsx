import React, { useContext, useState, useEffect } from 'react';
import { Formik } from 'formik';
import { commonPasswords } from './index';
import { AuthContext, useAxios } from '../../features/index';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Text, TextInput, View, SafeAreaView, TouchableOpacity } from 'react-native';


const PasswordChange = () => {
    const [weakPasswordResponse, setWeakPasswordResponse] = useState(false);
    const [numericPasswordResponse, setNumericPasswordResponse] = useState(false);
    const { user, loginUser, userPasswordStrength, userPasswordNumeric} = useContext(AuthContext);
    const api = useAxios();
    const navigation = useNavigation();

    const passwordMutation = useMutation({
        mutationFn: (variables) => handlePasswordUpdate(variables),
        onSuccess: () =>{
            navigation.navigate(`settings`);
        }
    });

    useEffect(()=>{
        if (!user) loginUser()
    },[])

    const initialValues = { password: '',new_password:'', confirm_new_password:''};

    const validate = (values) => {
        const errors = {};
        if (!values.password) {
            errors.password = 'Required';
        }
        if (!values.new_password) {
            errors.new_password = 'Required';
        }
        if (!values.confirm_new_password) {
            errors.confirm_new_password = 'Required';
        }
        if (values.confirm_new_password!==values.new_password) {
            errors.confirm_new_password = 'Password not the same';
        }
        if (commonPasswords.includes(values.new_password.toLowerCase())){
            errors.new_password = 'Password commonly used.';
        }
        if (values.new_password){
            userPasswordStrength(user?.email, user?.username, values.new_password, setWeakPasswordResponse);
            userPasswordNumeric(values.new_password, setNumericPasswordResponse);
            if (weakPasswordResponse){
              errors.new_password = 'Password not secure.';
            } else if (numericPasswordResponse){
              errors.new_password = 'Password not secure.';
            }
        }
        return errors;
    }

    const handlePasswordUpdate = async (passwords) =>{
        const config = {
            headers:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.post(
                "/api/password-change/",
                passwords,
                config
            )
            return response.data;
        } catch (error) {
        }
    };

    const handleSubmit = (values, setSubmitting) => {
        const passwords = {};
        passwords.current_password = values.password;
        passwords.new_password = values.new_password;
        passwordMutation.mutate(passwords);
        alert(JSON.stringify(passwords,null,2));
        setSubmitting(false);
    
    }
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }
    return (
        <SafeAreaView className="relative">
            <View className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <View className="p-4 sm:p-7">
                    <View className="text-center">
                    <Text className="block text-2xl font-bold text-gray-800 dark:text-white text-center">Update your password</Text>
                    <Text className="mt-2 text-sm text-gray-600 dark:text-neutral-400 text-center">
                        Remember it's your secret
                    </Text>
                    </View>
                    <View className="mt-5">
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
                        <View className="flex-1 items-center justify-center p-4">
                            <View className="grid w-full gap-y-4">
                                <View>
                                    <Text className="block text-sm mb-2 dark:text-white">Current password</Text>
                                    <View className="relative">
                                        <TextInput 
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry
                                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required aria-describedby="password-error"
                                        />
                                    </View>
                                    {errors.password && touched.password && (
                                        <Text className="text-xs text-red-600 mt-2">{errors.password}</Text>
                                    )}
                                    
                                </View>
                                <View>
                                    <View className="flex justify-between">
                                        <Text className="block text-sm mb-2 dark:text-white">New password</Text>
                                    </View>
                                    <View className="relative">
                                        <TextInput 
                                        onChangeText={handleChange('new_password')}
                                        onBlur={handleBlur('new_password')}
                                        value={values.new_password} 
                                        secureTextEntry
                                        className="py-3 px-4 block w-full border-gray-200 border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        />
                                    </View>
                                    {errors.new_password && touched.new_password && (
                                        <Text className="text-xs text-red-600 mt-2">{errors.new_password}</Text>
                                    )} 
                                    
                                </View>
                                <View>
                                    <View className="flex justify-between">
                                        <Text className="block text-sm mb-2 dark:text-white">Confirm password</Text>
                                    </View>
                                    <View className="relative">
                                        <TextInput 
                                        onChangeText={handleChange('confirm_new_password')}
                                        onBlur={handleBlur('confirm_new_password')}
                                        value={values.confirm_new_password} 
                                        secureTextEntry
                                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        />
                                    </View>
                                    {errors.confirm_new_password && touched.confirm_new_password && (
                                        <Text className="text-xs text-red-600 mt-2">{errors.confirm_new_password}</Text>
                                    )}
                                    
                                </View>
                                <TouchableOpacity 
                                onPress={handleSubmit} 
                                className="py-3 mt-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={isSubmitting||passwordMutation.isPending}
                                >
                                    <Text className="text-blue-50">Update password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )}
                    </Formik>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PasswordChange;
