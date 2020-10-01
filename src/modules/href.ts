/**
 * Defines all hrefs used for navigation.
 *
 * The hrefs are functions to discourage consumers from
 * performing string manipulation and to allow changes to
 * the parameters to either be backwards compatible
 * or fail fast and obviously due to type-errors.
 */

/**
 * Key-values assumed to be valid URI components.
 * this lets you have { required: string; optional?: string; }
 */
type Params = Record<string, string | undefined>;

/**
 * Returns full href: path and query parameters if any given
 */
function withQueryParams(url: string, params: Params = {}): string {
  const empty: string[] = [];
  const qParams = Object.entries(params).flatMap(([k, v]) => {
    if (v != null) {
      return empty
        .concat(v)
        .map((x) => `${encodeURIComponent(k)}=${encodeURIComponent(x)}`);
    }
    return empty;
  });
  return qParams.length > 0 ? `${url}?${qParams.join('&')}` : url;
}

/**
 * A function of `Params` (or void) that returns a string
 * suitable for use as an href.
 * @note See [conditional types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types)
 */
export type Href<P extends Params | void> = P extends void
  ? {
      (): string;
    }
  : {
      (params: P): string;
    };

const hrefs = {
  home(): string {
    return '/';
  },
  signUp(): string {
    return '/sign-up';
  },
};

export default hrefs as {
  // This type conversion prevents someone from adding an href
  // function that is neither () => string nor (params: Params) => string
  [K in keyof typeof hrefs]: Href<Parameters<typeof hrefs[K]>[0]>;
};
