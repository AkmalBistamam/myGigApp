import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Content1 from "./Content1";
import Product from "./Product";
import "./row.css";
const MyDashboard = (props) => {
    const history = useHistory();
    useEffect(() => { }, []);

    return (
        /** add content for dashboard inside the fragment */
        <Fragment>
            <Content1 />
            <Product />
        </Fragment>
    );
};
const mapState = (state) => {
    //
    return {};
};
const mapDispatch = (dispatch) => ({
    //
});

export default connect(mapState, mapDispatch)(MyDashboard);
