import React,{ useContext, Fragment, useState, useEffect } from 'react';
import { Formik } from 'formik';
import axios from "axios";
import { UsedEmails, CommonPasswords, RNModal, useToast, AuthContext } from '.';
import { useMutation } from '@tanstack/react-query';
import { Text, TextInput, View, SafeAreaView, TouchableOpacity, ScrollView, Pressable, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { parseDateForDRF } from '../../utils/dateTime';


const Register = () => {
    const toast = useToast();
    const { user, userPasswordStrength, userPasswordNumeric } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [weakPasswordResponse, setWeakPasswordResponse] = useState(false);
    const [numericPasswordResponse, setNumericPasswordResponse] = useState(false);
    const [checked, setChecked] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    const navigation = useNavigation();

    useEffect(()=>{
        if (user) navigation.navigate("Home");
    },[])

    const userMutation = useMutation({
        mutationFn: (variables)=> handleRegister(variables),
        onSuccess : (data)=> {
            navigation.navigate("Login")
        },
    });

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const initialValues = { email: '', username:'', password1:'', password2:'', birthday:'', sex:''};


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

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        }
        if (!values.username) {
            errors.username = 'Required';
        }
        if (!values.password1) {
            errors.password1 = 'Required';
        }
        if (values.password1.length < 9) {
            errors.password1 = 'Password too short';
        }
        if (CommonPasswords.includes(values.password1.toLowerCase())){
            errors.password1 = 'Password commonly used.';
        }
        if (values.email.length > 0 && values.email.toLowerCase().localeCompare(values.password1.toLowerCase()) ===0){
            errors.password1 = 'Password not secure.';
        }
        if (values.username.length > 0 && values.username.toLowerCase().localeCompare(values.password1.toLowerCase()) ===0){
            errors.password1 = 'Password not secure.';
        }
        if (!values.password2) {
            errors.password2 = 'Required';
        }
        if (!values.birthday) {
        if(formattedDate.trim() === ""){
            errors.birthday = 'Required';
        }
        if(formattedDate.trim() !== ""){
            values.birthday = formattedDate;
        }
        }
        if (!values.sex) {
            errors.sex = 'Required';
        }
        if (values.password1 !== values.password2) {
            errors.password2 = 'Passwords not the same';
        }
        if (UsedEmails.includes(values.email.toLowerCase())){
          errors.email = 'Already in use';
        }
        if (values.email&&values.username &&values.password1){
            userPasswordStrength(values.email, values.username, values.password1, setWeakPasswordResponse);
            userPasswordNumeric(values.password1, setNumericPasswordResponse);
            if (weakPasswordResponse){
                errors.new_password = 'Password not secure.';
            } else if (numericPasswordResponse){
                errors.new_password = 'Password not secure.';
            }
        }
        return errors;
    };
  
    const handleRegister = async (data) =>{
        const config = {
            headers:{
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await axios.post(
                "http://192.168.8.101:8000/api/profile/",
                data,
                config
            )
            return response.data;
        } catch (error) {
            toast.handleFail(error.response?.data?error.response?.data?.email[0]:error.message,toast);
        }
    };

    const data = {};
    const handleSubmit = (values, setSubmitting) => {
        if (formattedDate.trim()==="") return;
        data.email = values.email.toLowerCase();
        data.username = values.username;
        data.password = values.password1;
        data.birthday = formattedDate;
        data.sex = values.sex;
        userMutation.mutate(JSON.stringify(data, null, 2));
        setSubmitting(false);
    };

    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    };

    return (
        <Fragment>
            <SafeAreaView className="relative">
                <ScrollView className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <View className="p-4 sm:p-7">
                    <View className="text-center">
                    <Text className="block text-2xl font-bold text-gray-800 dark:text-white text-center">Sign up</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate("Login")} className="mt-2 text-sm text-gray-600 dark:text-neutral-400 text-center justify-center items-center">
                        <Text>Already have an account? </Text>
                        <Text className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" >
                        Sign in here
                        </Text>
                    </TouchableOpacity>
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
                                <Text className="block text-sm mb-2 dark:text-white">Email address</Text>
                                <View className="relative">
                                <TextInput  
                                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email} 
                                />
                                </View>
                                {errors.email && touched.email && (
                                <Text className="text-xs text-red-600 mt-2">{errors.email}</Text>
                                )}
                            </View>
                            <View>
                                <View className="flex justify-between">
                                <Text className="block text-sm mb-2 dark:text-white">Username</Text>
                                </View>
                                <View className="relative">
                                    <TextInput  
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                    />
                                </View>
                                {errors.username && touched.username && (
                                <Text className="text-xs text-red-600 mt-2">{errors.username}</Text>
                                )}
                            </View>
                            <View>
                                <View className="flex justify-between">
                                <Text className="block text-sm mb-2 dark:text-white">Password</Text>
                                </View>
                                <View className="relative">
                                    <TextInput
                                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                    onChangeText={handleChange('password1')}
                                    onBlur={handleBlur('password1')}
                                    value={values.password1}
                                    secureTextEntry
                                    />
                                </View>
                                {errors.password1 && touched.password1 && (
                                <Text className="text-xs text-red-600 mt-2">{errors.password1}</Text>
                                )}
                            </View>
                            <View>
                                <View className="flex justify-between">
                                <Text className="block text-sm mb-2 dark:text-white">Confirm Password</Text>
                                </View>
                                <View className="relative">
                                <TextInput 
                                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                onChangeText={handleChange('password2')}
                                onBlur={handleBlur('password2')}
                                value={values.password2}
                                secureTextEntry
                                />
                                </View>
                                {errors.password2 && touched.password2 && (
                                <Text className="text-xs text-red-600 mt-2">{errors.password2}</Text>
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
                            <View className="flex flex-col">
                                <TouchableOpacity 
                                onPress={handleSubmit}
                                className="py-3 mt-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={isSubmitting||userMutation.isPending||!checked}
                                >
                                <Text className="text-blue-50">Sign up</Text>
                                </TouchableOpacity>
                                <View className="flex flex-row items-center py-4">
                                <TouchableOpacity
                                    className="flex flex-row items-center"
                                    onPress={() => setChecked(!checked)}
                                >
                                    <MaterialIcons
                                    name={checked ? 'check-box' : 'check-box-outline-blank'}
                                    size={24}
                                    color="black"
                                    />
                                </TouchableOpacity>
                                <View className="text-lg text-center dark:-blue-100 text-slate-950 flex flex-row"> 
                                <Text>I agree to the </Text>
                                <Pressable onPress={toggleModal}><Text className="text-blue-500">terms and conditions</Text></Pressable>
                                </View>
                                </View>
                            </View>
                            <View className="flex flex-row items-center justify-center py-12 gap-4"></View>
                            </View>
                        </KeyboardAvoidingView>
                        )}
                        </Formik>
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
            <RNModal modalVisible={modalVisible} toggleModal={toggleModal}>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
                <Text className="py-5 font-palaquin font-normal text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.

                </Text>
            </RNModal>
        </Fragment>
    )
}

export default Register;


