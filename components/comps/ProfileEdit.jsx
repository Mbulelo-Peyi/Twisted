import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { parseDateForDRF } from '../../utils/dateTime';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

const ProfileEdit = ({ data, update }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');

    const initialValues = { 
        email: data?data?.email:'', 
        username: data?data?.username:'',
        bio: data?data?.bio:'', 
        birthday: data?data?.birthday:'', 
        sex: data?data?.sex:'',
    };
    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        }
        if (!values.username) {
            errors.username = 'Required';
        }
        if (!values.bio) {
            errors.bio = 'Required';
        }
        if (!values.birthday) {
            errors.birthday = 'Required';
        }
        if (!values.sex) {
            errors.sex = 'Required';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        const user = {};
        user.email = values.email.toLowerCase();
        user.username = values.username;
        user.bio = values.bio;
        user.password = values.password1;
        user.birthday = formattedDate;
        user.sex = values.sex;
        update?.mutate(user)
        setSubmitting(false);
    }
      const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }

    const onDateChange = (nativeEvent, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
        setShowDatePicker(false);
        setDate(currentDate);
        
        // Parse for DateField
        const parsedDate = parseDateForDRF(currentDate);
        setFormattedDate(parsedDate || 'Invalid date');
    };
        
    const showDate = () => {
        setShowDatePicker(prev=>!prev);
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
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        }) => (
            <KeyboardAvoidingView className="bg-white p-4 items-start">
                <View className="grid gap-y-4">
                    <View>
                        <Text className="block text-sm mb-2 dark:text-white">Email</Text>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            inputMode="email" 
                            maxLength={60}
                            autoComplete="email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email} 
                            />
                            {errors.email && touched.email && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.email && touched.email && (
                            <Text className="text-xs text-red-600 mt-2">{errors.email}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="block text-sm mb-2 dark:text-white">Username</Text>
                        </View>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            inputMode="text" 
                            maxLength={100}
                            onChangeText={handleChange("username")}
                            onBlur={handleBlur("username")}
                            value={values.username}
                            />
                            {errors.username && touched.username && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.username && touched.username && (
                            <Text className="text-xs text-red-600 mt-2">{errors.username}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="block text-sm mb-2 dark:text-white">Bio</Text>
                        </View>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            inputMode="text" 
                            maxLength={100} 
                            multiline={true}
                            onChangeText={handleChange("bio")}
                            onBlur={handleBlur("bio")}
                            value={values.bio}
                            ></TextInput>
                            {errors.bio && touched.bio && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.bio && touched.bio && (
                            <Text className="text-xs text-red-600 mt-2">{errors.bio}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex justify-between flex-row">
                            <Text className="block text-sm mb-2 dark:text-white">Birthday</Text>
                        </View>
                        <View className="relative">
                        <TouchableOpacity 
                        className="py-3 px-4 block w-full border text-center border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        onPress={showDate}>
                            <Text>{formattedDate}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            />
                        )}
                        </View>
                        {errors.birthday && touched.birthday && (
                            <Text className="text-xs text-red-600 mt-2">{errors.birthday}</Text>
                        )}
                    </View>
                    <View>
                        <View className="relative">
                            <View className="py-3 px-4 block w-full border-gray-200 border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                                <Text className="block text-sm mb-2 dark:text-white">Sex</Text>
                                <Picker
                                onBlur={handleBlur('sex')}
                                selectedValue={values.sex}
                                className="w-24 h-12"
                                onValueChange={(itemValue) => values.sex = itemValue}
                                >
                                <Picker.Item label="Select" value={""} />
                                <Picker.Item label="Male" value={"1"} />
                                <Picker.Item label="Female" value={"0"} />
                                <Picker.Item label="Other" value={"2"} />
                                </Picker>
                            </View>
                            {errors.sex && touched.sex && (
                                <Text className="text-xs text-red-600 mt-2">{errors.sex}</Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity 
                    onPress={handleSubmit} 
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting||update?.isPending}
                    >
                        <Text className="text-white text-sm font-semibold">update</Text>
                    </TouchableOpacity>
                    
                </View>
            </KeyboardAvoidingView>
        )}
        </Formik>
    )
}

export default ProfileEdit