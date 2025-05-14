import { View, Text } from 'react-native'
import React from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'

const BottomSheet = ({ bottomSheetRef, children }) => {
  return (
    <RBSheet
    ref={bottomSheetRef}
    height={300}
    openDuration={250}
    closeOnPressMask={true}
    closeOnPressBack={true}
    draggable={true}
    customStyles={{
        wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        draggableIcon: {
            backgroundColor: "gray",
            width: 100,
        },
        container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
    }}
    >
        <View>{children}</View>
    </RBSheet>
  )
}

export default BottomSheet