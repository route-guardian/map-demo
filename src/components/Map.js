import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGeolocations } from '../redux/actions/geolocations';
import { fetchSafetyScores } from '../redux/actions/safetyScores';
import classNames from 'classnames';
import { MAP_BOX } from '../redux/keys';
import createGeoJson from '../js/createGeoJson.js';
import RouteInput from './RouteInput';

class Map extends Component {

	constructor(props) {
		super(props);

		this.props.fetchSafetyScores();
		this.props.fetchGeolocations();
		this.state = {
			mapState: false,
			layerState: false,
			heatMap: true,
			geolocationMarkers: true,
			selectingLocation: false,
			inputA: '',
			inputB: '',
			inputMarkers: new Object
		}
	}

	componentDidMount() {
		const {mapState} = this.state;

		if(!mapState) {
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

	selectCoordinates = (input) => {
		const { inputMarkers } = this.state;
		
		this.setState({selectingLocation: true});

		this.map.once('click', (e) => { 
			document.querySelector('#'+input).value = e.lngLat.lng + ', ' + e.lngLat.lat;
			this.setState({
				[input]: e.lngLat.lng + ', ' + e.lngLat.lat
			})

			if(inputMarkers[input] !== undefined) {
				inputMarkers[input].remove();
			}

			let el = document.createElement('div');
				el.className = 'marker marker--' + input;

			inputMarkers[input] = new mapboxgl.Marker(el, { anchor: 'bottom' })
				.setLngLat([e.lngLat.lng, e.lngLat.lat])
				.addTo(this.map);


			this.setState({selectingLocation: false});
			return e.lngLat.lng + ', ' + e.lngLat.lat;
		});
	}

	toggleLayer = (layerId) => {
		if(this.state.mapState){
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
		const { mapState, layerState, selectingLocation, pointA, pointB } = this.state;

		if (mapState && !layerState) {
			this.generateGeolocationMarkers();
			const safetyGeoJson = createGeoJson(geolocations[0], safetyScores[0]);
			this.generateHeatMap(safetyGeoJson);
			this.setState({layerState: true});
		}

		const mapClasses = classNames({
			'mapBox' : true,
			'mapBox--selecting': selectingLocation
		})

		return (
			<React.Fragment>
				<RouteInput selectCoordinates={this.selectCoordinates} selectingLocation pointA pointB toggleLayer={this.toggleLayer}/>
				<div className={mapClasses} ref={el => this.mapContainer = el} ></div>
			</React.Fragment>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ fetchGeolocations, fetchSafetyScores }, dispatch);
}

function mapStateToProps({ geolocations, safetyScores }) {
	return { geolocations, safetyScores };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
