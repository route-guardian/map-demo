import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

class RouteInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pointA: '',
            buttonAActive: false,
            pointB: '',
            buttonBActive: false,
            update: false,
            heatMapButton: true,
            geolocationsButton: true,
            crimeButton: true,
            camerasButton: true,
            boundryButton: true
        }
    }

    componentDidMount() {
        const { selectCoordinates, selectLocation } = this.props;

        const buttonA = document.querySelector('#buttonA');
        buttonA.addEventListener('click', () => {
            this.setState({ pointAActive: true });
            console.log('button clicked :D');
            selectCoordinates('inputA');
            console.log(selectLocation);
        });

        const buttonB = document.querySelector('#buttonB');
        buttonB.addEventListener('click', () => {
            this.setState({ pointBActive: true });
            console.log('button clicked :D');
            selectCoordinates('inputB');
            console.log(selectLocation);
        });

        const generateRouteButton = document.querySelector('.generateButton');
        generateRouteButton.addEventListener('click', () => {
            this.props.generateRoute()
        });
    }

    toggleButton = (type, id, buttonState) => {
        const { toggleLayer } = this.props;
        if (type == 'layer') {
            toggleLayer(id);
        } else {
            let markers = document.querySelectorAll('.' + id);
            markers.forEach(marker => {
                if (marker.style.display == 'none') {
                    marker.style.display = 'block';
                } else {
                    marker.style.display = 'none'
                }
            });
        }
        this.setState({
            [buttonState]: !this.state[buttonState]
        })
    }

    render() {
        const { inputA, inputB, toggleLayer } = this.props;
        const { heatMapButton, geolocationsButton, crimeButton, camerasButton, boundryButton } = this.state;


        return (
            <div className="routeInput">
                <h2>Generate route</h2>
                <div className="row">
                    <span>From</span>
                </div>
                <div className="row">
                    <input type="text" id="inputA" value={inputA} disabled />
                    <div id="buttonA">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1.049 2.379h2.133l2.467 8.82h-1.78l-.63-2.328h-2.362l-.61 2.328H8.45l2.502-8.82zm.986 1.4c-.114.55-.264 1.273-.39 1.79l-.527 2.019h1.88l-.527-2.008c-.138-.55-.288-1.262-.402-1.8h-.034z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
                    </div>
                </div>
                <div className="row">
                    <span>To</span>
                </div>
                <div className="row">
                    <input type="text" id="inputB" value={inputB} disabled />
                    <div id="buttonB">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-.287 2.254c1.067 0 1.824.138 2.432.562.527.356.86.94.86 1.663 0 .802-.469 1.548-1.41 1.904v.047c.987.252 1.72 1.032 1.72 2.156 0 .688-.287 1.354-.803 1.812-.597.54-1.583.825-3.155.825-.837 0-1.468-.056-1.88-.114V4.438c.504-.104 1.376-.184 2.236-.184zm.195 1.262c-.367 0-.595.024-.744.058v2.34h.62c.963 0 1.536-.518 1.536-1.24 0-.872-.655-1.158-1.412-1.158zm-.744 3.636v2.752c.172.035.378.047.676.047.917 0 1.697-.414 1.697-1.412 0-1.02-.87-1.387-1.742-1.387h-.63z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
                    </div>
                </div>
                <div className="row">
                    <div className="generateButton">
                        Generate
                    </div>
                </div>
                <div className="row toggleButtons">
                    <div id="toggleHeatmap" className={classNames({ "emojiButton": true, "emojiButton--inactive": heatMapButton })} onClick={() => { this.toggleButton('layer', 'safety-heat', 'heatMapButton') }}>🔥</div>
                    <div id="toggleMarkers" className={classNames({ "emojiButton": true, "emojiButton--inactive": !geolocationsButton })} onClick={() => { this.toggleButton('domObjects', 'marker--geolocations', 'geolocationsButton') }}>📍</div>
                    <div id="toggleCrimeMarkers" className="emojiButton">😈</div>
                    <div id="toggleCameraMarkers" className="emojiButton">📹</div>
                    <div id="toggleBoundry" className="emojiButton">🚧</div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteInput);
