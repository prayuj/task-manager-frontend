import {
    Route,
    Redirect
} from "react-router-dom";
import { isLogin } from "../utils/utils"
const PrivateRoute = ({ children, ...rest }) => {
    return (<Route
        {...rest}
        render={({ location }) =>
            isLogin() ? (
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
