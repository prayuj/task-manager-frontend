import {
    Route,
    Redirect
} from "react-router-dom";
const PrivateRoute = ({ children, ...rest }) => {
    const auth = {}
    return (<Route
        {...rest}
        render={({ location }) =>
            auth.user ? (
                children
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                />
            )
        }
    />);
}

export default PrivateRoute;
