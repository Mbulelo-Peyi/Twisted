import React, { useContext, useEffect } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Text, TextInput, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import dayjs from 'dayjs';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
    const { user, SignIn } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(()=>{
        let isExpired = dayjs().isAfter(dayjs.unix(user?.exp));
        if(!isExpired) navigation.navigate('DrawerHome');
    },[]);

    const initialValues = { email: '', password:''};

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        }
        if (!values.password) {
            errors.password = 'Required';
        }
        return errors;
    }

    const loginMutation = useMutation({
        mutationFn: (variables)=> SignIn(variables),
        onSuccess: (data)=> {
            navigation.goBack();
        }
    });


    const handleSubmit = (values, setSubmitting) => {
        values.email = values.email.toLowerCase();
        loginMutation.mutate(JSON.stringify(values, null, 2));
        setSubmitting(false);
    }
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }
    return (
        <SafeAreaView className="relative top-[105px] justify-center">
            <View className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <View className="p-7">
                    <View className="text-center">
                        <Text className="block text-2xl font-bold text-gray-800 dark:text-white text-center">Sign in</Text>
                        <TouchableOpacity onPress={()=>navigation.navigate("Register")} className="mt-2 text-sm text-gray-600 dark:text-neutral-400 justify-center items-center">
                            <Text>Don't have an account yet?</Text>
                            <Text className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" >Sign up here</Text>
                        </TouchableOpacity>
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
                                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    />
                                    {errors.email && touched.email &&(
                                        <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3 ml-72">
                                        <Ionicons name="alert-circle-outline" color={"red"} size={24} />
                                    </View>
                                    )}
                                    
                                    </View>
                                    {errors.email && touched.email &&(
                                    <Text className="text-xs text-red-600 mt-2" id="email-error">{errors.email}</Text>
                                    )}
                                    
                                </View>
                                <View>
                                    <View className="flex">
                                    <Text className="block text-sm mb-2 dark:text-white">Password</Text>
                                    </View>
                                    <View className="relative">
                                    <TextInput 
                                    className="py-3 px-4 block w-full border-gray-200 border rounded-lg text-sm  focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry
                                    />
                                    {errors.password && touched.password &&(
                                        <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3 ml-72">
                                        <Ionicons name="alert-circle-outline" color={"red"} size={24} />
                                    </View>
                                    )} 
                                    
                                    </View>
                                    {errors.password && touched.password &&(
                                    <Text className="text-xs text-red-600 mt-2" id="password-error">{errors.password}</Text>
                                    )} 
                                    
                                </View>
                                <TouchableOpacity 
                                onPress={handleSubmit} 
                                className="py-3 mt-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={isSubmitting||loginMutation.isPending}
                                >
                                    <Text className="text-blue-50">Sign in</Text>
                                </TouchableOpacity>
                                <Text className="text-sm text-blue-600 decoration-2 hover:underline font-medium">Forgot password?</Text>
                            
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

export default Login
