import React, { Component } from 'react';
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class DDL extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    genRows() {
        let rows = [];
        for (let i in this.props.SDL[this.props.link].items) {
            rows.push(
                <tr key={i}>
                    <td></td>
                    <td><Form.Control id={i} value={this.props.SDL[this.props.link].items[i]} onChange={(e) => this.props.updateDDI(this.props.link, e.target.id, e.target.value)}/></td>
                    <td>
                        { i !== Object.keys(this.props.SDL[this.props.link].items)[Object.keys(this.props.SDL[this.props.link].items).length - 1] ?
                        <Button id={i} variant="light" onClick={(e) => this.props.deleteDDI(e.target.id, this.props.link)}>Remove Item</Button>
                        :
                        <Button id={this.props.link} variant="secondary" onClick={() => this.props.addDDI(this.props.link)}>Add Item</Button>
                        }
                    </td>
                </tr>
            );
        }
        return rows;
    }

    render() {
        return (
            <React.Fragment>
                {this.genRows()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    SDL: state.SDL,
});

const mapDispatchToProps = dispatch => ({
    addDDI: (list) => dispatch({
        type: "add_ddl_item",
        payload: list,
    }),
    deleteDDI: (item, list) => dispatch({
        type: "delete_ddl_item",
        payload: {item: item, list: list},
    }),
    updateDDI: (list, item, value) => dispatch({
        type: "update_ddl_item",
        payload: {item: item, list: list, value: value},
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DDL);
