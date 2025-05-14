import React, { useContext, useEffect } from 'react';
import { Formik } from 'formik';
import { AuthContext, useAxios } from '../../features/index';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Text, TextInput, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Complaint = () => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const navigation = useNavigation();
    const initialValues = { issue: '',};

    const issueMutation = useMutation({
        mutationFn: (variables)=> fileAComplaint(variables),
        onSuccess: (data)=> {
            alert("Complaint Successfully Sent")
            navigation.navigate('DrawerHome');
        }
    });

    useEffect(()=>{
        if(!user) navigation.navigate('DrawerHome');
    },[])

    const validate = (values) => {
        const errors = {};
        if (!values.issue) {
            errors.issue = 'Required';
        }
        return errors;
    };

    const fileAComplaint = async (data) =>{
        const config = {
            headers:{
                "Content-Type": "application/json",
            },
        };
        await api.post(`/api/complaint-create/`,data,config)
        .then(res=>{return res.data}).catch(err=>{return err})
    };
  
    const handleSubmit = (values, setSubmitting) => {
        issueMutation.mutate(JSON.stringify(values, null, 2));
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
                        <Text className="block text-2xl font-bold text-gray-800 dark:text-white text-center">Something wrong?</Text>
                        <Text className="mt-2 text-sm text-gray-600 dark:text-neutral-400 text-center">
                            Write us a Report
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
                            <KeyboardAvoidingView className="flex-1 items-center justify-center p-4">
                                <View className="grid w-full gap-y-4">
                                    <View>
                                        <Text className="block text-sm mb-2 dark:text-white">Complaint</Text>
                                        <View className="relative">
                                            <TextInput 
                                            onChangeText={handleChange('issue')}
                                            onBlur={handleBlur('issue')}
                                            value={values.issue}  
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                            required aria-describedby="issue-error"
                                            ></TextInput>
                                            {errors.issue && touched.issue && (
                                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3 ml-80">
                                                    <Ionicons name="alert-circle-outline" color={"red"} size={24} />
                                                </View>
                                            )}
                                            
                                            </View>
                                            {errors.issue && touched.issue && (
                                                <Text className="text-xs text-red-600 mt-2" id="issue-error">{errors.issue}</Text>
                                            )}
                                            
                                    </View>
                                    <TouchableOpacity 
                                    onPress={handleSubmit} 
                                    className="py-3 mt-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                    disabled={isSubmitting||issueMutation.isPending}
                                    >
                                        <Text className="text-blue-50">Report</Text>
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

export default Complaint;
