import React from "react";
import { StatusBar, YellowBox } from "react-native";

import Routes from "./src/routes";

YellowBox.ignoreWarnings(["Unrecognized WebSocket"]);

export default function App() {
	return (
		<>
			<StatusBar barStyle="light-content" backgroundColor="#0078FF" />
			<Routes />
		</>
	);
}
