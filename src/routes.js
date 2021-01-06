import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Routes = createAppContainer(
	createStackNavigator(
		{
			Main: {
				screen: Main,
				navigationOptions: {
					title: "TOUR",
				},
			},
			Profile: {
				screen: Profile,
				navigationOptions: {
					title: "INSTAGRAM",
				},
			},
		},
		{
			defaultNavigationOptions: {
				animationEnabled: true,
				headerTitleAlign: "center",
				headerBackTitleVisible: false,
				headerTintColor: "#fff",
				headerStyle: {
					backgroundColor: "#0078FF",
				},
			},
		}
	)
);

export default Routes;
