import { View, Text, Image } from 'react-native'
import React from 'react'
import { formatCurrency } from '../constants/utils'

const UpcomingSubscriptionCard = ({ name, price, daysLeft, icon, currency }) => {
  return (
    <View style={{marginRight: 16, width: 158, borderRadius: 16, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff9e3",
      padding: 16
    }}>
      <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
        <Image source={icon} style={{width: 56, height: 56,}}/>
        <View>
          <Text style={{fontSize: 18, fontFamily: "sans-bold", color: "#081126"}}>{formatCurrency(price, currency)}</Text>
          <Text style={{fontSize: 14, fontFamily: "sans-semibold", color: "rgba(0, 0, 0, 0.6)",}} numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
          </Text>
        </View>
      </View>
      <Text style={{marginTop: 8, fontSize: 18, fontFamily: "sans-bold", color: "#081126",}} numberOfLines={1}>{name}</Text>
    </View>
  )
}

export default UpcomingSubscriptionCard