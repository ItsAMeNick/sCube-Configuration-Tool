import _ from "lodash";

const initialState = {
    page: 1,
    GRD: {
        alias: "",
        module: "",
        type: "",
        sub_type: "",
        category: "",
    }
};

const sCubeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "dump_store": {
            console.log(state);
            return state;
        }

        case "update_page_number": {
            let newState = _.cloneDeep(state);
            newState.page = action.payload;
            return newState;
        }

        case "update_page_data": {
            let newState = _.cloneDeep(state);
            newState[action.payload.page][action.payload.field] = action.payload.value;
            return newState;
        }

        default: return state;
    }
};

export default sCubeReducer;
