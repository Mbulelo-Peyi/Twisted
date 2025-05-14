import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const ImageInputField = ({ setFieldValue, file, setPermissionStatus, permissionStatus, setFile }) => {
  const checkPermissions = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    setPermissionStatus(status);
    if (status !== 'granted') {
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(newStatus);
      if (newStatus !== 'granted') {
        alert('Permission to access storage is required!');
      }
    }
  };

  const pickImage = async () => {
    await checkPermissions();
    if (permissionStatus === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setFieldValue('files', result.assets);
        setFile(result.assets); // Store all selected images
      }
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity onPress={pickImage}>
        <View style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {file?.length > 0 ? 'Change Selected Files' : 'Select Files'}
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView horizontal contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
        {file?.map((obj, i) => (
          <Image
            key={i}
            source={{ uri: obj.uri }}
            style={{ width: 200, height: 200, marginRight: 10 }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ImageInputField;
