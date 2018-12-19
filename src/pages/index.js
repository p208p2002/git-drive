import React, { Component } from 'react'
import UpLoad from '../modules/UpLoadModule/index'
class View extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        return (
            <div className="container">
                <UpLoad/>
            </div>
        );
    }
}

export default View;