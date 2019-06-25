import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGeolocations } from '../redux/actions/geolocations';
import { fetchSafetyScores } from '../redux/actions/safetyScores';
import { MAP_BOX } from '../redux/keys';

class Map extends Component {

    constructor(props) {
        super(props);

        this.props.fetchSafetyScores();
        this.props.fetchGeolocations();
    }

    componentDidMount() {
        mapboxgl.accessToken = MAP_BOX;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [4.47917, 51.9025],
            zoom: 12,
            pitch: 45
        });
    }

    componentWillUnmount() {
        this.map.remove();
    }

    componentDidUpdate() {
        const { geolocations, safetyScores } = this.props;

        if (geolocations.length > 0) {
            geolocations.forEach((location) => {
                console.log(location);
            });
        }
    }

    generateMarkers = () => {
        const { geolocations, safetyScores } = this.props;

        for (var location in geolocations[0]) {
            const lat = geolocations[0][location][0];
            const lng = geolocations[0][location][1];
            const safetyScore = safetyScores[0][location];

            if (lat !== undefined || lng !== undefined) {
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setText(location + ' [' + safetyScore + ']' + ' [' + lng + ' ' + lat + ']');

                new mapboxgl.Marker()
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(this.map);
            }
        }
    }

    render() {
        const { geolocations, safetyScores } = this.props;

        if (geolocations.length > 0) {
            this.generateMarkers();
        }

        return (
            <div className="mapBox" ref={el => this.mapContainer = el} ></div>
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
