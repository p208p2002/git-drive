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
                <a
                    href="https://github.com/p208p2002/git-drive/blob/master/README.md"
                    rel='noopener noreferrer'
                    target='_blank'
                >
                Get some problem?
                </a>
                <UpLoad/>
            </div>
        );
    }
}

export default View;