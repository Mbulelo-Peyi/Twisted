import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const FaqCard = ({question}) => {
    const [show, setShow] = useState(false);
    return (
        <View className="max-w-full mx-auto h-fit">
            <TouchableOpacity onPress={()=>setShow(prev=>!prev)} className="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg">
                <Text className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
                    {question?.question}
                </Text>
                {show && (
                    <View className="mt-3 bg-slate-200 rounded-md p-1">
                        <Text className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {question?.answer}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default FaqCard