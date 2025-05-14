import { Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import ToastContext from './ToastService';
import React, { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);

    const open = (component, timeout) => {
        const id = Date.now();
        setToasts(toasts =>[...toasts, {id, component}])
        setTimeout(()=>close(id), 10000);

    };

    const close = (id) => setToasts(toasts =>toasts.filter(toast => toast.id === id))

    const handleFail = (data,toast) => {
        open(
          <View className="flex gap-2 bg-red-300 text-red-800 p-4 rounded-lg shadow-lg">
            <Feather name='alert-circle' size={40} />
            <View>
              <Text className="font-bold">Action Failed</Text>
              <Text className="text-sm">{data}</Text>
            </View>
          </View>,
          10000
        )
        setTimeout(()=>toast.close(toast.id), 10000);
    };
    const handleSuccess = (data,toast) => {
        open(
          <View className="flex gap-2 bg-green-300 text-green-800 p-4 rounded-lg shadow-lg">
            <FontAwesome name='check-circle' />
            <View>
              <Text className="font-bold">Success</Text>
              <Text className="text-sm">{data}</Text>
            </View>
          </View>,
          10000
        )
        setTimeout(()=>toast.close(toast.id), 10000);
    };

    return (
        <ToastContext.Provider value={{open,close,handleSuccess,handleFail}}>
          {children}
          <View className="absolute space-y-2 bottom-4 right-4">
            {toasts.map(({id, component})=>(
              <View key={id} className="relative">
                <TouchableOpacity 
                onPress={() => close(id.id)}
                className="top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60">
                    <AntDesign name='closecircleo' size={16}/>
                </TouchableOpacity>
                {component}
              </View>
            ))}
          </View>
        </ToastContext.Provider>
    )
}

export default ToastProvider;

