import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import hrefs, { Href } from 'src/modules/href';
import HomePage from './pages/HomePage';

/* eslint-disable @typescript-eslint/no-explicit-any */
type HrefProps<H extends Href<any>> = H extends () => string
  ? {} // A parameterless href yields an empty props object
  : H extends (params: infer Params) => string
  ? Params // An href with parameters yields those parameters as props
  : never;

/**
 * For a given type of Href, get the search params
 * as an object e.g. ?id=123 gives { id: '123' }
 */
const getUrlSearchParams = <H extends Href<any>>(
  props: RouteComponentProps<HrefProps<H>>
): Record<HrefProps<H>, string> => {
  const search = props.location.search;
  const urlSearchParams = new URLSearchParams(search);
  const params: Record<string, string> = {};
  for (const [key, value] of urlSearchParams) {
    params[key] = value;
  }
  return params;
};

/**
 * For a given type of Href, this provides type-safe conversion
 * of url parameters to page component props.
 */
const render = <H extends Href<any>>(
  Component: React.ComponentType<HrefProps<H>>
) => (props: RouteComponentProps<HrefProps<H>>): React.ReactNode => {
  return <Component {...props.match.params} {...getUrlSearchParams(props)} />;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Defines all client-side routes within the app.
 */
export default function Routes(): JSX.Element {
  return (
    <>
      <Switch>
        <Route
          path={hrefs.home()}
          render={render<typeof hrefs.home>(HomePage)}
        />
      </Switch>
    </>
  );
}
