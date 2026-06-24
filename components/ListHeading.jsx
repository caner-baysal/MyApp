import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react';

const ListHeading = ({title}) => {
  return (
    <View style={{marginVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <Text style={{fontSize: 20, fontFamily: "sans-bold", color: "#081126"}}>{title}</Text>
      <TouchableOpacity style={{borderRadius: 9999, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.2)", paddingHorizontal: 16, paddingVertical: 4}}>
        <Text style={{fontSize: 18, fontFamily: "sans-semibold", color: "#081126"}}>View All</Text>
      </TouchableOpacity>
    </View> 
  )
}

export default ListHeading