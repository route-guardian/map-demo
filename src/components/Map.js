import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGeolocations } from '../redux/actions/geolocations';
import { fetchSafetyScores } from '../redux/actions/safetyScores';
import { fetchCrime } from '../redux/actions/crime';
import { fetchCameras } from '../redux/actions/cameras';
import classNames from 'classnames';
import { MAP_BOX } from '../redux/keys';
import createGeoJson from '../js/createGeoJson.js';
import RouteInput from './RouteInput';
import axios from 'axios';

class Map extends Component {

	constructor(props) {
		super(props);

		this.props.fetchSafetyScores();
		this.props.fetchGeolocations();
		this.props.fetchCrime();
		this.props.fetchCameras();

		this.state = {
			mapState: false,
			layerState: false,
			heatMap: true,
			geolocationMarkers: true,
			selectingLocation: false,
			route: false,
			inputA: undefined,
			inputB: undefined,
			inputMarkers: new Object
		}
	}

	componentDidMount() {
		const { mapState } = this.state;

		if (!mapState) {
			this.generateMap();
		}
	}

	componentWillUnmount() {
		this.map.remove();
	}

	generateMap = () => {
		mapboxgl.accessToken = MAP_BOX;
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [4.4758, 51.9194],
			zoom: 15,
			pitch: 45
		});

		this.map.addControl(new mapboxgl.NavigationControl());

		this.map.on('load', () => {
			this.setState({
				mapState: true,
			});
		});
	}

	resetRoute = () => {
		if (this.map.getLayer('route')) {
			this.map.removeLayer('route');
			this.map.removeSource('route');
			this.setState({ route: false });
		}
	}

	generateRoute = () => {

		this.resetRoute();

		const start = this.state.inputA.split(", ");
		const end = this.state.inputB.split(", ");


		axios.post('http://127.0.0.1:5000/point', {
			startPoint: {
				"lat": start[1],
				"long": start[0]
			},
			endPoint: {
				"lat": end[1],
				"long": end[0]
			}
		})
			.then((response) => {
				console.log(response.data);
				console.log(response.data.response.route[0].waypoint);

				let generatedPoints = '';

				response.data.response.route[0].waypoint.forEach(element => {
					console.log(element.mappedPosition);
					generatedPoints += element.mappedPosition.longitude + ',' + element.mappedPosition.latitude + ';';
				});

				if (this.state.mapState) {
					const directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/walking/'
						+ start[0] + ',' + start[1] + ';'
						+ generatedPoints
						+ end[0] + ',' + end[1]
						+ '?steps=true&geometries=geojson&access_token='
						+ MAP_BOX;

					axios.get(directionsRequest)
						.then((response) => {
							console.log(response)
							const route = response.data.routes[0].geometry;
							this.map.addLayer({
								'id': 'route',
								'type': 'line',
								'source': {
									'type': 'geojson',
									'data': {
										'type': 'Feature',
										'geometry': route
									}
								},
								'layout': {
									'line-join': 'round',
									'line-cap': 'round'
								},
								'paint': {
									'line-color': '#E37B40',
									'line-width': 8
								}
							});
							this.setState({ route: true });
						});
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	generateGeolocationMarkers = () => {
		const { geolocations, safetyScores } = this.props;

		for (var location in geolocations[0]) {
			const lat = geolocations[0][location][0];
			const lng = geolocations[0][location][1];
			const safetyScore = safetyScores[0][location];

			if (lat !== undefined || lng !== undefined) {
				const popup = new mapboxgl.Popup({ offset: 50 })
					.setText(location + ' [' + safetyScore + ']' + ' [' + lng + ' ' + lat + ']');

				let el = document.createElement('div');
				el.className = 'marker marker--geolocations';
				new mapboxgl.Marker(el, { anchor: 'bottom' })
					.setLngLat([lng, lat])
					.setPopup(popup)
					.addTo(this.map);
			}
		}
	}

	generateCrimeMarkers = () => {
		const { crime } = this.props;

		crime[0].points.forEach(crimeLocation => {
			const lat = crimeLocation[0];
			const lng = crimeLocation[1];
			console.log(lat, lng)
			if (lat !== undefined || lng !== undefined) {
				// const popup = new mapboxgl.Popup({ offset: 50 })
				// 	.setText(location + ' [' + safetyScore + ']' + ' [' + lng + ' ' + lat + ']');

				let el = document.createElement('div');
				el.className = 'marker marker--crime';
				new mapboxgl.Marker(el, { anchor: 'bottom' })
					.setLngLat([lat, lng])
					// .setPopup(popup)
					.addTo(this.map);
			}
		});
	}

	generateBoundry = () => {
		this.map.addLayer({
			'id': 'boundry-layer',
			'type': 'fill',
			'source': {
				'type': 'geojson',
				'data': {
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "Polygon",
						"coordinates": [
							[
								[4.46713397107527, 51.92543609635268],
								[4.478894224192658, 51.925800184226034],
								[4.4835014228346495, 51.916739922307954],
								[4.472977452985617, 51.91440320664418],
								[4.46713397107527, 51.92543609635268]
							]
						]
					}
				}
			},
			'paint': {
				'fill-color': 'rgba(70,179,157, 0.2)',
				'fill-outline-color': 'rgba(0, 0, 0, 1)'
			}
		});
	}

	generateCameraMarkers = () => {
		const { cameras } = this.props;

		cameras[0].points.forEach(cameraLocation => {
			const lat = cameraLocation[0];
			const lng = cameraLocation[1];
			console.log(lat, lng)
			if (lat !== undefined || lng !== undefined) {
				// const popup = new mapboxgl.Popup({ offset: 50 })
				// 	.setText(location + ' [' + safetyScore + ']' + ' [' + lng + ' ' + lat + ']');

				let el = document.createElement('div');
				el.className = 'marker marker--camera';
				new mapboxgl.Marker(el, { anchor: 'bottom' })
					.setLngLat([lat, lng])
					// .setPopup(popup)
					.addTo(this.map);
			}
		});
	}

	selectCoordinates = (input) => {
		const { inputMarkers } = this.state;

		this.setState({ selectingLocation: true });

		this.map.once('click', (e) => {
			document.querySelector('#' + input).innerHTML = e.lngLat.lng + ', ' + e.lngLat.lat;
			this.setState({
				[input]: e.lngLat.lng + ', ' + e.lngLat.lat
			})

			if (inputMarkers[input] !== undefined) {
				inputMarkers[input].remove();
			}

			let el = document.createElement('div');
			el.className = 'marker marker--' + input;

			inputMarkers[input] = new mapboxgl.Marker(el, { anchor: 'bottom' })
				.setLngLat([e.lngLat.lng, e.lngLat.lat])
				.addTo(this.map);


			this.setState({ selectingLocation: false });
			return e.lngLat.lng + ', ' + e.lngLat.lat;
		});
	}

	toggleLayer = (layerId) => {
		if (this.state.mapState) {
			const visibility = this.map.getLayoutProperty(layerId, 'visibility');

			if (visibility === 'visible') {
				this.map.setLayoutProperty(layerId, 'visibility', 'none');
			} else {
				this.map.setLayoutProperty(layerId, 'visibility', 'visible');
			}
		}
	}

	generateHeatMap = (safetyGeoJson) => {
		const { heatMap } = this.state;

		const heatMapId = 'safety-heat';
		// Add a geojson point source.
		// Heatmap layers also work with a vector tile source.
		this.map.addSource('safetyData', {
			"type": "geojson",
			"data": safetyGeoJson
		});

		this.map.addLayer({
			id: heatMapId,
			type: 'heatmap',
			source: 'safetyData',
			maxzoom: 15,
			paint: {
				// increase weight as diameter breast height increases
				'heatmap-weight': {
					property: 'data',
					type: 'exponential',
					stops: [
						[1, 0],
						[62, 1]
					]
				},
				// increase intensity as zoom level increases
				'heatmap-intensity': {
					stops: [
						[14, 1],
						[15, 1]
					]
				},
				// assign color values be applied to points depending on their density
				'heatmap-color': [
					'interpolate',
					['linear'],
					['heatmap-density'],
					0, 'rgba(236,222,239,0)',
					0.2, 'rgb(208,209,230)',
					0.4, 'rgb(166,189,219)',
					0.6, 'rgb(103,169,207)',
					0.8, 'rgb(28,144,153)'
				],
				// increase radius as zoom increases
				'heatmap-radius': {
					stops: [
						[14, 175],
						[15, 125]
					]
				},
				// decrease opacity to transition into the circle layer
				'heatmap-opacity': {
					default: 1,
					stops: [
						[14, 1],
						[15, 0]
					]
				},
			}
		}, 'waterway-label');
	}

	render() {
		const { geolocations, safetyScores } = this.props;
		const { mapState, layerState, selectingLocation, route, inputA, inputB } = this.state;

		if (mapState && !layerState) {
			this.generateGeolocationMarkers();
			this.generateCrimeMarkers();
			this.generateCameraMarkers();
			this.generateBoundry();
			const safetyGeoJson = createGeoJson(geolocations[0], safetyScores[0]);
			this.generateHeatMap(safetyGeoJson);
			this.setState({ layerState: true });
			// this.generateRoute();
		}

		const mapClasses = classNames({
			'mapBox': true,
			'mapBox--selecting': selectingLocation
		})

		return (
			<React.Fragment>
				<RouteInput
					selectCoordinates={this.selectCoordinates}
					selectingLocation
					toggleLayer={this.toggleLayer}
					generateRoute={this.generateRoute}
					resetRoute={this.resetRoute}
					route={route}
					inputA={inputA}
					inputB={inputB} />
				<div className={mapClasses} ref={el => this.mapContainer = el} ></div>
			</React.Fragment>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchGeolocations, fetchSafetyScores, fetchCrime, fetchCameras }, dispatch);
}

function mapStateToProps({ geolocations, safetyScores, crime, cameras }) {
	return { geolocations, safetyScores, crime, cameras };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
