import React from 'react';
import { Modal as RNModal, View, KeyboardAvoidingView, Platform, TouchableOpacity, } from 'react-native';
import  { EvilIcons, } from '@expo/vector-icons/';


const Modal = ({isOpen, onClose, withInput, children}) =>{
    const content = withInput?(
        <KeyboardAvoidingView
        className="items-center justify-center flex-1 px-3 bg-zinc-900/40"
        behavior={Platform.OS === "ios"?"padding":"height"}
        >{children}</KeyboardAvoidingView>
    ):(
        <View
        onPress={onClose}
        className={`
        fixed inset-0 flex justify-center z-[21] items-center transition-colors
        ${isOpen ? 'visible bg-zinc-900/40' : 'invisible'}
        `}
        >
            <View
            onPress={e=>{e.stopPropagation()}}
            className={`
            bg-zinc-900/40 rounded-xl shadow p-6 transition-all h-fit top-9 w-10/12 justify-center
            ${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`} 
            >
                <TouchableOpacity 
                onPress={onClose}
                className="absolute top-4 right-3 rounded-lg text-gray-400 bg-white z-[21]"
                >
                    <EvilIcons name='close-o' size={24} />
                </TouchableOpacity>
                {children}
            </View>
        </View>
    )
    return (
        <RNModal
        visible={isOpen}
        transparent
        animationType='fade'
        statusBarTranslucent
        >{content}</RNModal>
    )
};

export default Modal;