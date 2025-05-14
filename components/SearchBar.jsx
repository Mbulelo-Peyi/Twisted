import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const SearchBar = ({ handleSearch, setSearch, placeholder, search }) => {
    return (
        <View className="flex flex-row justify-center items-center space-x-4">
            <TextInput
            inputMode="text"
            placeholder={placeholder}
            value={search}
            onChangeText={(e)=>setSearch(e)}
            className="mb-4 p-2 border rounded w-10/12 flex-1"
            />
            <TouchableOpacity className="bg-blue-200 items-baseline content-center h-auto p-1 rounded-full bottom-2" onPress={handleSearch}>
                <AntDesign name='search1' size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar