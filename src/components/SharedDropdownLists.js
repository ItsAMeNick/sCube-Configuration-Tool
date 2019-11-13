import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";

class DDL extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    <Card.Text>
                        Field Stuffs
                    </Card.Text>
                </Card.Body>
                <Card.Footer/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(DDL);
