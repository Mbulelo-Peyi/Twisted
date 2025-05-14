import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const RNModal = ({modalVisible, toggleModal, children}) => {
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-center items-center mt-5 w-full bg-transparent bg-opacity-25 backdrop-blur-sm flex  z-20">
          <View className="bg-white rounded-lg items-center w-full py-4 shadow-md">
            <TouchableOpacity className="text-white text-xl place-self-end rounded-full hover:bg-slate-400" onPress={toggleModal}>
              <Ionicons name="close-circle-outline" size={24} />
            </TouchableOpacity>
            <ScrollView className="bg-white p-2 pb-24 rounded h-auto">
              <View className="p6">
                <Text className="text-lg font-monsterrat font-semibold text-gray-900 mb-5">Terms & Conditions</Text>
              </View>
              {children}
            </ScrollView>
          </View>
        </View>
        
      </Modal>
    )
}

export default RNModal