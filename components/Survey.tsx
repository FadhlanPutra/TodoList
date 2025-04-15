import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Fontisto } from '@expo/vector-icons'
import tw from 'twrnc'

const Survey = ({title, onPress, selected}: any) => {
    // const [tekan, setTekan] = useState(false);
  return (
    <View>
        <TouchableOpacity onPress={onPress} style={tw`flex-row justify-between bg-gray-300 items-center p-3 rounded-lg my-1.5`}>
            <Text style={tw`text-lg`}>{title}</Text>
            <Fontisto name={selected ? 'radio-btn-active' : 'radio-btn-passive'} size={20} />
        </TouchableOpacity>
    </View>
  )
}

export default Survey