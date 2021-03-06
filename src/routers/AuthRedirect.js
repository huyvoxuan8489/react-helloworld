import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';

// async function sendRequest() {
//     debugger;
//     const response = null;
//     //const data = await response.json();
//     //console.log('data', data);
// };
// sendRequest();

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

class AuthRedirect extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const autLinks = [
            { path: '/login', component: Login },
            { path: '/public', component: Public },
            { path: '/protected', component: Protected },
        ];
        return (
            <Router>
                <div>
                    <AuthButton />
                    <ul>
                        <li><Link to={autLinks[1].path}>Public Page</Link></li>
                        <li><Link to={autLinks[2].path}>Protected Page</Link></li>
                    </ul>
                    <Route path={autLinks[1].path} component={autLinks[1].component} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/protected" component={Protected} />
                </div>
            </Router>
        )
    }
}

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

const AuthButton = withRouter(
    ({ history }) =>
        fakeAuth.isAuthenticated ? (
            <p>
                Welcome!{" "}
                <button
                    onClick={() => {
                        fakeAuth.signout(() => history.push("/"));
                    }}
                >
                    Sign out
        </button>
            </p>
        ) : (
                <p>You are not logged in.</p>
            )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            fakeAuth.isAuthenticated ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    };

    login = () => {
        fakeAuth.authenticate(() => {
            this.setState({ redirectToReferrer: true });
        });
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        );
    }
}

export default AuthRedirect;