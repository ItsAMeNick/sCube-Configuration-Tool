import _ from "lodash";

const initialState = {
    page: 0,
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

        default: return state;
    }
};

export default sCubeReducer;
