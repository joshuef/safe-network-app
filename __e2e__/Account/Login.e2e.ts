import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';

import {
    assertNoConsoleErrors,
    getPageUrl,
    getPageTitle,
    getByAria
} from '../helpers';

fixture`Login Flow`
    .page('../../app/app.html')
    .beforeEach(async () => {
        await waitForReact();
        // @ts-ignore
        await clickOnMainMenuItem(['Tests', `Skip OnBoard App`]);
    })
    .afterEach(async (t) => {
        await assertNoConsoleErrors(t);
        // @ts-ignore
        await clickOnMainMenuItem(['Tests', 'Reset application list']);
    });

test('can navigate to login, which has standard state', async (t) => {
    const loginButton = getByAria('Login Button');
    const password = getByAria('Password Field');
    const passphrase = getByAria('Passphrase Field');
    const stayLoggedIn = getByAria('Keep me logged in');

    await t.click(loginButton);
    await t
        .expect(password.exists)
        .ok()
        .expect(passphrase.exists)
        .ok();
    // .expect( stayLoggedIn.exists )
    // .ok()
    // .expect( stayLoggedIn.checked )
    // .notOk();
});

// TODO: Setup e2e to always have authd running. (as part of app?)
// Right now authd must be setup and running manually
test('can navigate to login, and attempt/fail to login', async (t) => {
    const loginButton = getByAria('Login Button');
    const password = getByAria('Password Field');
    const passphrase = getByAria('Passphrase Field');
    const stayLoggedIn = getByAria('Keep me logged in');
    const error = getByAria('Login Error');

    await t.click(loginButton);
    await t
        .expect(password.exists)
        .ok()
        .expect(passphrase.exists)
        .ok()
        // .expect( stayLoggedIn.exists )
        // .ok()
        .typeText(password, 'no')
        .typeText(passphrase, 'no')
        .click(loginButton)
        .wait(5000)
        .expect(error.exists)
        .ok();
});
