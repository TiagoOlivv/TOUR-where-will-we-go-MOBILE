import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Image,
	View,
	Text,
	TextInput,
	TouchableOpacity
} from "react-native";

import MapView, { Marker, Callout } from "react-native-maps";
import {
	requestPermissionsAsync,
	getCurrentPositionAsync
} from "expo-location";

import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import { connect, disconnect, subscribeToNewLocals } from "../services/socket";

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: "#fff"
	},
	callout: {
		width: 260
	},
	localName: {
		fontWeight: "bold",
		fontSize: 16
	},
	all: {
		color: "#666"
	},
	searchForm: {
		position: "absolute",
		top: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: "row"
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: "#fff",
		color: "#333",
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 2
	},

	loadButton: {
		width: 50,
		height: 50,
		backgroundColor: "#0078FF",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 15
	},
	form: {
		flex: 1,
		justifyContent: "space-between"
	}
});

export default ({ navigation }) => {
	const [locals, setLocals] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [specialties, setSpecialties] = useState("");

	useEffect(() => {
		async function loalInitialPosition() {
			const { granted } = await requestPermissionsAsync();

			if (granted) {
				const { coords } = await getCurrentPositionAsync({
					enableHighAccuracy: true
				});

				const { latitude, longitude } = coords;

				setCurrentRegion({
					latitude,
					longitude,
					latitudeDelta: 0.018,
					longitudeDelta: 0.018
				});
			}
		}

		loalInitialPosition();
	}, []);

	useEffect(() => {
		subscribeToNewLocals(local => setLocals([...locals, local]));
	}, [locals]);

	function setupWebSocket() {
		disconnect();

		const { latitude, longitude } = currentRegion;

		connect(latitude, longitude, specialties);
	}

	async function loadLocals() {
		const { latitude, longitude } = currentRegion;

		const response = await api.get("/search", {
			params: { latitude, longitude, specialties }
		});

		setLocals(response.data.locals);
		setupWebSocket();
	}

	function handleRegionChange(region) {
		setCurrentRegion(region);
	}

	if (!currentRegion) {
		return null;
	}

	return (
		<>
			<MapView
				onRegionChangeComplete={handleRegionChange}
				initialRegion={currentRegion}
				style={styles.map}
			>
				{locals.map(local => (
					<Marker
						key={local._id}
						coordinate={{
							longitude: local.location.coordinates[0],
							latitude: local.location.coordinates[1]
						}}
					>
						<Image
							style={styles.avatar}
							source={{
								uri: local.avatar_url
							}}
						/>

						<Callout
							onPress={() => {
								navigation.navigate("Profile", {
									instagram_username: local.instagram_username
								});
							}}
						>
							<View style={styles.callout}>
								<Text style={styles.localName}>{local.full_name}</Text>
								<Text style={styles.all}>{local.biography}</Text>
								<Text style={styles.all}>{local.acting}</Text>
								<Text style={styles.all}>{local.specialties.join(", ")}</Text>
								<Text style={styles.all}>{local.phone}</Text>
							</View>
						</Callout>
					</Marker>
				))}
			</MapView>
			<View style={styles.searchForm}>
				<TextInput
					style={styles.searchInput}
					placeholder={"Deseja buscar por qual comida?"}
					placeholderTextColor={"#999"}
					autoCapitalize="words"
					autoCorrect={false}
					value={specialties}
					onChangeText={setSpecialties}
				/>
				<TouchableOpacity onPress={loadLocals} style={styles.loadButton}>
					<MaterialIcons name="my-location" size={20} color="#fff" />
				</TouchableOpacity>
			</View>
		</>
	);
};
