import React from 'react';
import { Route, Switch } from 'react-router';

import { AccountOverview } from '$Pages/AccountPage/AccountOverview';
import { AccountOnBoarding } from '$Pages/AccountPage/AccountOnBoarding';
import { CreateAccountPage } from '$Pages/AccountPage/CreateAccountPage';
import { LoginPage } from '$Pages/AccountPage/LoginPage';

import { EarnInvite } from '$Pages/AccountPage/EarnInvite';
import { GetInvite } from '$Pages/AccountPage/GetInvite';
import { RequestCommunityInvite } from '$Pages/AccountPage/RequestCommunityInvite';

import { AuthDState } from '$Definitions/application.d';

// import styles from './Account.css';

import {
    ACCOUNT,
    ACCOUNT_ONBOARDING,
    ACCOUNT_LOGIN,
    ACCOUNT_CREATE,
    ACCOUNT_INVITES_GET,
    ACCOUNT_INVITES_EARN,
    ACCOUNT_INVITES_REQUEST
} from '$Constants/routes.json';
import { notificationTypes } from '../../constants/notifications';

interface Props {
    logInToNetwork: Function;
    authd: AuthDState;
}

export const AccountPage = ( props: Props ) => {
    return (
        <Switch>
            <Route exact path={ACCOUNT} render={() => <AccountOverview />} />

            <Route path={ACCOUNT_ONBOARDING} component={AccountOnBoarding} />
            <Route
                path={ACCOUNT_LOGIN}
                render={() => (
                    <LoginPage
                        isLoggedIn={props.authd.isLoggedIn}
                        isWorking={props.authd.isWorking}
                        loginError={props.authd.error}
                        logInToNetwork={props.logInToNetwork}
                        setAuthdWorking={props.setAuthdWorking}
                    />
                )}
            />
            <Route
                path={ACCOUNT_CREATE}
                render={() => (
                    <CreateAccountPage
                        isLoggedIn={props.authd.isLoggedIn}
                        isWorking={props.authd.isWorking}
                        createAccount={props.createAccount}
                        setAuthdWorking={props.setAuthdWorking}
                        createAccountError={props.authd.error}
                    />
                )}
            />

            <Route path={ACCOUNT_INVITES_GET} component={GetInvite} />
            <Route
                path={ACCOUNT_INVITES_REQUEST}
                component={RequestCommunityInvite}
            />
            <Route path={ACCOUNT_INVITES_EARN} component={EarnInvite} />
        </Switch>
    );
};
