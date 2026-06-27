import { Pressable, Text, View } from "react-native";
import { colors } from "../constants/theme";

const ListHeading = ({ title, actionLabel, onActionPress }) => {
  return (
    <View
      style={{
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "sans-bold",
          color: colors.primary,
        }}
      >
        {title}
      </Text>

      {!!actionLabel && !!onActionPress && (
        <Pressable
          onPress={onActionPress}
          style={{
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.2)",
            paddingHorizontal: 16,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "sans-semibold",
              color: colors.primary,
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ListHeading;