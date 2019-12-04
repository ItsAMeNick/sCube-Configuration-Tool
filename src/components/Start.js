import React, { Component } from 'react';
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import DatabaseLoad from "./DatabaseLoad.js";

class STRT extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(event) {
        // Looks a little out of order, but with FileReader you set
        // up what you want to do with the file before you attempt to read the Information
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
            this.props.load(event.target.result);
        };
        if (window.confirm("Loading a save will overwrite any changes that have been made during the current session.  Please make sure to save your work.  Would you like to continue?")) {
            reader.readAsText(file);
        } else {
            document.getElementById("file_loadsave").value = "";
            return -1;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card.Body>
                    <Card.Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac semper tellus, quis hendrerit eros. Quisque id commodo metus. Etiam consequat lectus est, nec finibus lectus dapibus sed. Sed neque felis, dictum euismod luctus vel, gravida molestie ex. Nulla quis enim eget lorem sodales ornare vel vel orci. Integer porttitor nunc at bibendum tempor. Quisque libero erat, condimentum eget massa eget, suscipit pretium sem. Maecenas libero ligula, aliquam id purus vitae, tincidunt aliquam velit. Sed sodales, urna vitae cursus vulputate, risus odio venenatis odio, in pellentesque est eros id lectus. Sed eu velit non turpis dapibus commodo et et eros. Pellentesque pellentesque neque eget neque venenatis, id pharetra ipsum elementum.
                    </Card.Text>
                </Card.Body>
                <DatabaseLoad/>
                <Card.Body>
                    <p>Load File: </p>
                    <input type="file" name="file" id="file_loadsave" onChange={(e) => this.handleChange(e)}/>
                </Card.Body>
                <Card.Footer/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    load: state => dispatch({
        type: "load_state",
        payload: state
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(STRT);
