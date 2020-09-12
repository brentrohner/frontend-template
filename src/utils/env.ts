enum Stage {
  Prod = 'prod',
  Staging = 'staging',
}

export enum DeploymentEnv {
  Test = 'test',
  Dev = 'dev',
  Staging = 'staging',
  Prod = 'prod',
}

export function determineDeploymentEnv(
  nodeEnv: typeof process['env']['NODE_ENV'],
  stage: typeof process['env']['REACT_APP_STAGE']
): DeploymentEnv {
  if (nodeEnv === 'production') {
    if (stage && stage === Stage.Prod) {
      return DeploymentEnv.Prod;
    } else if (stage && stage === Stage.Staging) {
      return DeploymentEnv.Staging;
    } else {
      return DeploymentEnv.Dev;
    }
  }
  if (nodeEnv === 'test') {
    return DeploymentEnv.Test;
  }

  return DeploymentEnv.Dev;
}

export const DEPLOYMENT_ENV = determineDeploymentEnv(
  process.env.NODE_ENV,
  process.env.REACT_APP_STAGE
);

/**
 * Use the NODE_ENV and REACT_APP_STAGE environment variables to select a value appropriate for
 * dev, test, staging and production environments, defaulting to the local value.
 *
 * @param devValue used in dev mode and as a fallback
 * @param stagingValue used in staging
 * @param prodValue used in production
 * @param testValue used in test mode if given, else use devValue
 */
export function pickValueForDeploymentEnv(
  devValue: string,
  stagingValue: string,
  prodValue: string,
  testValue?: string
): string {
  switch (DEPLOYMENT_ENV) {
    case DeploymentEnv.Prod:
      return prodValue;
    case DeploymentEnv.Staging:
      return stagingValue;
    case DeploymentEnv.Test:
      return testValue ? testValue : devValue;
    default:
      return devValue;
  }
}
