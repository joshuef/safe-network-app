import React, { Component } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';
import { Route, Switch } from 'react-router';

import styles from './Account.css';

import { logger } from '$Logger';

export const GetInvite = ( props ) => {
    return (
        <React.Fragment>
            <Typography variant="h5">Get an invite</Typography>

            <Typography variant="body2">
                Invites can be gifted by existing Account holders. It’s a
                sharable link that will allow you to get started.
            </Typography>

            <Grid container>
                <Typography>
                    <Button
                    // onClick={}
                    >
                        Ask A Friend
                    </Button>
                </Typography>
                <Button
                    // onClick={}
                    aria-label="Redeem Invite"
                >
                    I already have an invite
                </Button>
            </Grid>
        </React.Fragment>
    );
};
