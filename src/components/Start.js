import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";

class STRT extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <Card.Header>
                    <strong>{this.props.title}</strong>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac semper tellus, quis hendrerit eros. Quisque id commodo metus. Etiam consequat lectus est, nec finibus lectus dapibus sed. Sed neque felis, dictum euismod luctus vel, gravida molestie ex. Nulla quis enim eget lorem sodales ornare vel vel orci. Integer porttitor nunc at bibendum tempor. Quisque libero erat, condimentum eget massa eget, suscipit pretium sem. Maecenas libero ligula, aliquam id purus vitae, tincidunt aliquam velit. Sed sodales, urna vitae cursus vulputate, risus odio venenatis odio, in pellentesque est eros id lectus. Sed eu velit non turpis dapibus commodo et et eros. Pellentesque pellentesque neque eget neque venenatis, id pharetra ipsum elementum.
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

export default connect(mapStateToProps, mapDispatchToProps)(STRT);
