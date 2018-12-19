import React, { Component } from 'react'
import UpLoad from '../modules/UpLoadModule/index'
class View extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="container">
                <b>This website uses cookies to enhance the user experience</b>
                <br />
                <small>If you continue to use, you agree to this policy.</small>
                <br />
                <a
                    href="https://github.com/p208p2002/git-drive/blob/master/README.md"
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    Get some problem on use?
                </a>
                <hr />
                <UpLoad />
            </div>
        );
    }
}

export default View;