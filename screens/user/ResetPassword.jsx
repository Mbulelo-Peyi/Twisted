import React,{ useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../features/index';
import { useMutation } from '@tanstack/react-query';
import { Text, TextInput, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
  });

const ResetPassword = () => {
    const { reset_password } = useContext(AuthContext);
    const navigation = useNavigation(); 
    const initialValues = { email: '' }

    const resetPasswordMutation = useMutation({
        mutationFn: (variables)=> reset_password(variables),
        onSuccess: (data)=> {
            alert('An Email was sent to your email address to reset your password')
            navigation.navigate('Login');
        }
    });

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Please include a valid email address so we can get back to you';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        resetPasswordMutation.mutate(values);
        setSubmitting(false);
    };
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    };
    return (
        <SafeAreaView className="relative">
            <View className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <View className="p-4 sm:p-7">
                    <View className="text-center">
                    <Text className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</Text>
                    <Text className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        <Text>Forgot your password? </Text>
                        <Text className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500">
                            Enter your email
                        </Text>
                    </Text>
                    </View>
                    <View className="mt-5">
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
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    }) => (
                        <KeyboardAvoidingView className="flex-1 items-center justify-center p-4">
                            <View className="grid w-full gap-y-4">
                                <View>
                                    <Text className="block text-sm mb-2 dark:text-white">Email address</Text>
                                    <View className="relative">
                                        <TextInput 
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        />
                                        {errors.email && touched.email &&(
                                            <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3 ml-80">
                                                <Ionicons name="alert-circle-outline" color={"red"} size={24} />
                                            </View>
                                        )} 
                                    </View>
                                    {errors.email && touched.email && (
                                        <Text className="text-xs text-red-600 mt-2" >{errors.email}</Text>
                                    )}
                                </View>
                            <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitting||resetPasswordMutation.isPending}
                            className="py-3 mt-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <Text className="text-blue-50">Reset password</Text>
                            </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                    </Formik>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ResetPassword;
