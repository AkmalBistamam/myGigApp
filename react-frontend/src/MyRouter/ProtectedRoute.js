import { connect } from "react-redux";
import LoginPage from "../components/LoginPage/LoginPage";

const ProtectedRoute = ({ children, user, isLoggedIn, ...rest }) => {
    // <Route
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
    if (isLoggedIn) {
        return (
            children
        );
    }
    else {
        return <LoginPage />
    }
};

const mapState = (state) => {
    const { isLoggedIn, user } = state.auth;
    console.log("User Name", user.name, "Admin Status", user.isAdmin, "IsloggedIn", isLoggedIn);
    return { isLoggedIn, user };
};

const mapDispatch = (dispatch) => ({
    //
});

export default connect(mapState, null)(ProtectedRoute);
