import { useState } from "react";
import { View, Text, Image } from "react-native";
import { formatCurrency } from "../constants/utils";
import { icons } from "../constants/icons";
import { colors } from "../constants/theme";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  iconUrl,
  currency,
}) => {
  const [iconFailed, setIconFailed] = useState(false);

  const iconSource = iconFailed
    ? icons.wallet
    : iconUrl
      ? { uri: iconUrl }
      : icon;

  return (
    <View
      style={{
        marginRight: 16,
        width: 176,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.upcomingCard,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          source={iconSource}
          onError={() => setIconFailed(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          }}
        />

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            style={{
              fontSize: 17,
              fontFamily: "sans-bold",
              color: "#081126",
            }}
          >
            {formatCurrency(price, currency || "USD")}
          </Text>

          <Text
            style={{
              marginTop: 2,
              fontSize: 13,
              fontFamily: "sans-semibold",
              color: "rgba(0, 0, 0, 0.6)",
            }}
            numberOfLines={1}
          >
            {daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 17,
          fontFamily: "sans-bold",
          color: "#081126",
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;