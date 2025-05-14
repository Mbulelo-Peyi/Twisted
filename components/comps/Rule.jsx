import React from 'react';
import { Formik } from 'formik';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Rule = ({ data, create, update, remove }) => {
    const initialValues = { text: data?data?.text:'' };
    const validate = (values) => {
        const errors = {};
        if (!values.text) {
          errors.text = 'Required';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        console.log(values);
        data?update?.mutate(values):create?.mutate(values)
        setSubmitting(false);
    }
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
                        <Text className="block text-sm mb-2 dark:text-white">Rule</Text>
                        <View className="relative">
                            <TextInput 
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="text-error"
                            inputMode="text" 
                            maxLength={60}
                            autoComplete={undefined}
                            onChangeText={handleChange("text")}
                            onBlur={handleBlur("text")}
                            value={values.text} 
                            ></TextInput>
                            {errors.text && touched.text && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.text && touched.text && (
                            <Text className="text-xs text-red-600 mt-2" id="email-error">{errors.text}</Text>
                        )}
                    </View>
                    {data ? (
                        <View className="flex flex-row space-x-2">
                            <TouchableOpacity 
                            onPress={handleSubmit} 
                            className="w-1/2 py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >
                                <Text className="text-white text-sm font-semibold">update rule</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>remove?.mutate()} 
                            className="w-1/2 py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >
                                <Text className="text-white text-sm font-semibold">delete rule</Text>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <TouchableOpacity 
                        onPress={handleSubmit}  
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={isSubmitting||create?.isPending}
                        >
                            <Text className="text-white text-sm font-semibold">Create rule</Text>
                        </TouchableOpacity>
                    )}
                    
                </View>
            </KeyboardAvoidingView>
        )}
        </Formik>
    )
}

export default Rule