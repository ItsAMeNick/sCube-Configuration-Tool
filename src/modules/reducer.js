import _ from "lodash";
import uuidv1 from "uuid/v1";

const initialState = {
    page: 2,
    GRD: {
        alias: "",
        module: "",
        type: "",
        sub_type: "",
        category: "",
    },
    CF: {
        group_code: "",
        sub_groups: {},
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

        case "add_CF_subgroup": {
            let newState = _.cloneDeep(state);
            let id = uuidv1();
            newState.CF.sub_groups[id] = {
                id: id,
                subgroup: ""
            };
            return newState;
        }

        case "del_CF_subgroup": {
            let newState = _.cloneDeep(state);
            delete newState.CF.sub_groups[action.payload]
            return newState;
        }

        default: return state;
    }
};

export default sCubeReducer;
