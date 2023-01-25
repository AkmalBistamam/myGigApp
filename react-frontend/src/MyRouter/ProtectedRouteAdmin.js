import React from "react";
import { connect } from "react-redux";
import NoMatchAdmin from "./NoMatchAdmin";
// import { Redirect, Route } from "react-router-dom";



const ProtectedRouteAdmin = ({ children, user, isLoggedIn, ...rest }) => {
    if (isLoggedIn && user.isAdmin) {
        return (
            children
            // <Route
            //     {...rest}
            //     render={({ location }) =>
            //         isLoggedIn ? (
            //             children
            //         ) : (
            //             <Redirect
            //                 to={{
            //                     pathname: "/login",
            //                     state: { from: location },
            //                 }}
            //             />
            //         )
            //     }
            // />
        );
    }
    else {
        return <NoMatchAdmin />
    }
    // return (
    //     <Route
    //         {...rest}
    //         render={({ location }) =>
    //             isLoggedIn ? (
    //                 children
    //             ) : (
    //                 <Redirect
    //                     to={{
    //                         pathname: "/login",
    //                         state: { from: location },
    //                     }}
    //                 />
    //             )
    //         }
    //     />
    // );
};

const mapState = (state) => {
    const { isLoggedIn, user } = state.auth;
    return { isLoggedIn, user };
};

const mapDispatch = (dispatch) => ({
    //
});

export default connect(mapState, null)(ProtectedRouteAdmin);
