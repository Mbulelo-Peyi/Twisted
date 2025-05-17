import React, { useState } from 'react';
import { Formik } from 'formik';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { parseDateTimeForDRF } from '../../utils/dateTime';



const EventAdd = ({ data, create, remove, update }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    const initialValues = { 
        title: data?data?.title:'', 
        description: data?data?.description:'', 
        date: data?data?.date:'', 
        venue: data?data?.venue:'',
    };
    const validate = (values) => {
        const errors = {};
        if (!values.title) {
          errors.title = 'Required';
        }
        if (!values.description) {
          errors.description = 'Required';
        }
        if (!values.date) {
            errors.date = 'Required';
        }
        if (!values.venue) {
            errors.venue = 'Required';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        if (formattedDate.trim() === "") return;
        const event = {};
        event.title = values.title;
        event.description = values.description;
        event.venue = values.venue;
        event.date = formattedDate?formattedDate:values.venue;
        alert(event)
        data?update?.mutate(event):create?.mutate(event)
        setSubmitting(false);
    }
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    };

    const onDateChange = (nativeEvent, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
        setShowDatePicker(false);
        setDate(currentDate);
        
        // Parse for DateField
        const parsedDate = parseDateTimeForDRF(currentDate);
        setFormattedDate(parsedDate || 'Invalid date');
    };
            
    const showDate = () => {
        setShowDatePicker(prev=>!prev);
    };

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
            <KeyboardAvoidingView className="bg-white p-4 mx-auto" onSubmit={handleSubmit}>
                <View className="grid gap-y-4">
                    <View>
                        <Text className="block text-sm mb-2 dark:text-white">Event Title</Text>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            inputMode="text" 
                            placeholder="Event name ..."
                            maxLength={60}
                            autoComplete={undefined}
                            onChangeText={handleChange("title")}
                            onBlur={handleBlur("title")}
                            value={values.title} 
                            />
                            {errors.title && touched.title && (
                                <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <AntDesign name="warning" size={16} />
                                </View>
                            )}
                        </View>
                        {errors.title && touched.title && (
                            <Text className="text-xs text-red-600 mt-2">{errors.title}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex justify-between items-center">
                            <Text className="block text-sm mb-2 dark:text-white">Description</Text>
                        </View>
                        <View className="relative">
                            <TextInput  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="description-error"
                            inputMode="text" 
                            placeholder="Event description ..."
                            maxLength={100} 
                            onChangeText={handleChange("description")}
                            onBlur={handleBlur("description")}
                            value={values.description}
                            ></TextInput>
                            {errors.description && touched.description && (
                            <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <AntDesign name="warning" size={16} />
                            </View>
                            )}
                        </View>
                        {errors.description && touched.description && (
                        <Text className="text-xs text-red-600 mt-2">{errors.description}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex justify-between items-center">
                            <Text className="block text-sm mb-2 dark:text-white">Venue</Text>
                        </View>
                        <View className="relative">
                            <TextInput 
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="venue-error"
                            inputMode="text"
                            id="venue" 
                            name="venue"
                            placeholder="Venue ..."
                            autoComplete={undefined}
                            onChangeText={handleChange("venue")}
                            onBlur={handleBlur("venue")}
                            value={values.venue}
                            />
                            {errors.venue && touched.venue && (
                            <View className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <AntDesign name="warning" size={16} />
                            </View>
                            )}
                        </View>
                        {errors.venue && touched.venue && (
                            <Text className="text-xs text-red-600 mt-2">{errors.venue}</Text>
                        )}
                    </View>
                    <View>
                        <View className="flex justify-between flex-row">
                            <Text className="block text-sm mb-2 dark:text-white">Date</Text>
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
                    {data ? (
                        <View className="flex flex-row space-x-2">
                            <TouchableOpacity 
                            className="w-1/2 py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-green-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            ><Text className="text-white text-sm font-semibold">Update event</Text></TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>remove?.mutate()} 
                            className="w-1/2 py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            ><Text className="text-white text-sm font-semibold">De event</Text></TouchableOpacity>
                        </View>
                    ):(
                        <TouchableOpacity className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={isSubmitting||create?.isPending}
                        ><Text className="text-white text-sm font-semibold">Create event</Text></TouchableOpacity>
                    )}
                    
                </View>
            </KeyboardAvoidingView>
        )}
        </Formik>
    )
}

export default EventAdd