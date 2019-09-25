import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";

class GRD extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>General Record Information</strong>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Field Stuffs
                    </Card.Text>
                </Card.Body>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GRD);
