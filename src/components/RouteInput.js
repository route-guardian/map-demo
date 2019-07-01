import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class RouteInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pointA: '',
            buttonAActive: false,
            pointB: '',
            buttonBActive: false,
            update: false
		}
    }

    componentDidMount() {
        const {selectCoordinates, selectLocation} = this.props;
        
        const inputA = document.querySelector('#inputA');
        const buttonA = document.querySelector('#buttonA');
        buttonA.addEventListener('click', () => {
            this.setState({pointAActive: true});
            console.log('button clicked :D');
            selectCoordinates('inputA');
            console.log(selectLocation);
        });
    }

    componentDidUpdate() {
        // const inputA = document.querySelector('#inputA');
        // console.log('pointA value', inputA.value);
        // // this.setState({
        // //     pointA: inputA.value
        // // });
        // console.log('pointA state', this.state.pointA);
        console.log(this.props.selectLocation);
    }

    componentWillUnmount() {
    }

    render() {
        const {pointA, pointB} = this.state;

        return (
            <div className="routeInput">
                <h2>Generate route</h2>
                <div className="row">
                    <span>From</span>
                </div>
                <div className="row">
                    <input type="text" id="inputA" value={pointA} disabled/>
                    <div id="buttonA">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                    </div>
                </div>
                <div className="row">
                    <span>To</span>
                </div>
                <div className="row">
                    <input type="text" id="inputB" value={pointB} disabled/>
                    <div id="buttonB">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                    </div>
                </div>
                <div className="row">
                    <button>
                        Generate
                    </button>
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
