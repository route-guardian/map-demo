import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWeather } from '../redux/actions/weather';

class ApiTest extends Component {

    componentDidMount() {
        this.fetchWeatherAction();
    }

    fetchWeatherAction = () => {
        this.props.fetchWeather('Rotterdam');
    }

    render() {
        const { weather } = this.props;

        return (
            <div>
                {weather.length > 0 &&
                    <span>{weather[0].city.name}</span>
                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchWeather }, dispatch);
}

function mapStateToProps({ weather }) {
    return { weather };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiTest);
