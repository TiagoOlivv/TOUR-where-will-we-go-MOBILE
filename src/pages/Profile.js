import React from "react";
import { WebView } from "react-native-webview";

export default ({ navigation }) => {
	const instagramUsername = navigation.getParam("instagram_username");

	return (
		<WebView
			style={{ flex: 1 }}
			source={{ uri: `https://www.instagram.com/${instagramUsername}` }}
		/>
	);
};
