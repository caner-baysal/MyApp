import { Tabs } from "expo-router";
import { tabs } from "../../constants/data";
import { View, Image } from "react-native";
import clsx from "clsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {colors, components} from "../../constants/theme";

const tabBar = components.tabBar;

const TabLayout = () => {
    const insets = useSafeAreaInsets();
    const TabIcon = ({ focused, icon }) => {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View
                    style={[
                        {
                            width: 48,
                            height: 32,
                            borderRadius: 16,
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        focused && {
                            backgroundColor: "#2563eb",
                        },
                    ]}
                >
                    <Image
                        source={icon}
                        style={{
                            width: 22,
                            height: 22,
                            resizeMode: "contain",
                        }}
                    />
                </View>
            </View>
        );
    };
    return (
        <Tabs screenOptions={{ 
                headerShown: false, 
                tabBarShowLabel: false, 
                tabBarStyle: { 
                    position: "absolute",
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    heigth: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                    },
                    tabBarItemStyle: {
                        paddingVertival: tabBar.height / 2 - tabBar.iconFrame / 1.6
                    },
                    tabBarIconStyle: {
                        width: tabBar.iconFrame,
                        height: tabBar.iconFrame,
                        alignItems: "center"
                    }
                }}>
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }}>

                </Tabs.Screen>
            ))}
        </Tabs>
    )
}

export default TabLayout