import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useLocalModel, useModel } from '@modern-js/runtime/model';
import { Navigate, To, useLocation } from '@modern-js/runtime/router';
import {
  LoginForm,
  LoginMainFooterBandItem,
  LoginPage,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { useCallback } from 'react';
import { logoImgSrc, PageTitle } from '@/components';
import { usePathWithParams } from '@/hooks';
import authModel from '@/models/auth';
import loginFormModel from '@/models/loginForm';

export default () => {
  const { _ } = useLingui();
  const [state, actions] = useLocalModel(loginFormModel);
  const [{ user }, { setUser, saveToLocalStorage }] = useModel(authModel);
  const location = useLocation();
  const to = usePathWithParams('/', ['locale']);

  const from: To = location.state?.from || to;

  const handleUsernameChange = useCallback(
    (_event: React.FormEvent<HTMLInputElement>, value: string) => {
      actions.setUsername(value);
    },
    [actions.setUsername],
  );

  const handlePasswordChange = useCallback(
    (_event: React.FormEvent<HTMLInputElement>, value: string) => {
      actions.setPassword(value);
    },
    [actions.setPassword],
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      actions.login().then(setUser).then(saveToLocalStorage);
    },
    [state.username, state.password, state.showHelperText, actions.validate],
  );

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <>
      <PageTitle title={_(msg`Login`)} />
      <LoginPage
        loginTitle={_(msg`Log in to your account`)}
        brandImgSrc={logoImgSrc}
        brandImgAlt={_(msg`SILENT AUCTION Logo`)}
        signUpForAccountMessage={
          <LoginMainFooterBandItem>
            <Trans>
              Need an account?{' '}
              <a href="https://www.patternfly.org/">Sign up.</a>
            </Trans>
          </LoginMainFooterBandItem>
        }
      >
        <LoginForm
          showHelperText={state.showHelperText}
          helperText={_(msg`Invalid login credentials`)}
          helperTextIcon={<ExclamationCircleIcon />}
          usernameLabel={_(msg`Username`)}
          usernameValue={state.username.value}
          onChangeUsername={handleUsernameChange}
          isValidUsername={state.showHelperText ? state.username.isValid : true}
          passwordLabel={_(msg`Password`)}
          passwordValue={state.password.value}
          onChangePassword={handlePasswordChange}
          isValidPassword={state.showHelperText ? state.password.isValid : true}
          loginButtonLabel={_(msg`Login`)}
          isLoginButtonDisabled={state.loading}
          onSubmit={handleFormSubmit}
        />
      </LoginPage>
    </>
  );
};
