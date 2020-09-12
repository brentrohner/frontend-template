/**
 * Utilities for shared use among redux action modules that need to
 * make async requests and follow a pattern of pending/success/failure.
 * This pattern is referred throughout as the "request pattern".
 */

import { Action } from 'redux';

/**
 * Base request action interface, common to all "request pattern" actions.
 * All redux actions require a `type` field and all "request pattern"
 * actions include request metadata as the `meta` field.
 */
export interface RequestAction<ActionType extends string, Meta extends object>
  extends Action<ActionType> {
  /** Metadata for the request. */
  meta: Meta;
}

/**
 * Pending request action, extending from the base request action interface.
 * @example
 * {
 *   type: 'POST_COMMENT_REQUEST',
 *   meta: { objectId: 'd1', objectType: 'Discussion' }
 * }
 */
type PendingAction<
  PendingActionType extends string,
  Meta extends object
> = RequestAction<PendingActionType, Meta>;

/**
 * Successful request action, extending from the base request action interface.
 * In addition to the `type` and `meta` fields, successes contain a typed `Response`
 * as the `response` field.
 * @example
 * {
 *   type: 'POST_COMMENT_SUCCESS',
 *   meta: { objectId: 'd1', objectType: 'Discussion' },
 *   response: 'post successful'
 * }
 */
interface SuccessAction<
  SuccessActionType extends string,
  Meta extends object,
  Response
> extends RequestAction<SuccessActionType, Meta> {
  /** Successful request response. */
  response: Response;
}

/**
 * Failed request action, extending from the base request action interface.
 * In addition to the `type` and `meta` fields, failures contain a typed `Error`
 * as the `error` field.
 * @example
 * {
 *   type: 'POST_COMMENT_FAILURE',
 *   meta: { objectId: 'd1', objectType: 'Discussion' },
 *   error: new Error('Unauthorized')
 * }
 */
interface FailureAction<FailureActionType extends string, Meta extends object>
  extends RequestAction<FailureActionType, Meta> {
  // TODO: CPD-8714 Decide on typed error handling approach in redux
  /** Failed request error. */
  error: Error;
}

/**
 * Types the exported set of "request pattern" actions that consumers can dispatch.
 */
export type RequestActions<
  PendingActionType extends string,
  SuccessActionType extends string,
  FailureActionType extends string,
  Meta extends object,
  Response
> = {
  /** Pending request action, ready for dispatch as-is. */
  pending: PendingAction<PendingActionType, Meta>;
  /**
   * Success request action creator.
   * @param response Successful request response.
   * @returns Success request action.
   */
  success(response: Response): SuccessAction<SuccessActionType, Meta, Response>;
  /**
   * Failed request action creator.
   * @param error Error originating from the failed request.
   * @returns Failed request action.
   */
  failure(error: Error): FailureAction<FailureActionType, Meta>;
};

/**
 * As request metadata is only available at runtime, we have to dynamically
 * create actions on-the-fly that all share this same metadata. For example,
 * to post a comment about an object, we create "request pattern" actions
 * `pending`, `success` and `failure`, all sharing `{ objectId, objectType }`
 * as metadata that describes the target object.
 *
 * To create these actions, the `ActionsBuilder` interface exposes `types` (which
 * do not depend on metadata) and the `actions` function that builds concrete
 * actions from metadata.
 * @example
 * function postComment(objectId: string, objectType: string, builder: ActionsBuilder) {
 *   const {
 *     types,   // pending/success/failure action types
 *     actions, // function to build the actions from metadata
 *   } = builder;
 *   const meta = { objectId, objectType };
 *   const {
 *     pending, // dispatch to signal request is pending
 *     success, // dispatch to signal request responded with success
 *     failure, // dispatch to signal request failed
 *   } = actions(meta);
 *   // ...
 * }
 */
export interface ActionsBuilder<
  PendingActionType extends string,
  SuccessActionType extends string,
  FailureActionType extends string,
  Meta extends object,
  Response
> {
  /** Types of the built actions. */
  types: {
    /** Pending request type. */
    pending: PendingActionType;
    /** Successful request type. */
    success: SuccessActionType;
    /** Failed request type. */
    failure: FailureActionType;
  };
  /**
   * Request actions builder function.
   * @param meta Metadata to share across all the built request actions.
   * @returns Built "request pattern" actions.
   */
  actions(
    meta: Meta
  ): RequestActions<
    PendingActionType,
    SuccessActionType,
    FailureActionType,
    Meta,
    Response
  >;
}

/**
 * Helper type for inferring the type of request actions for a given
 * `ActionsBuilder`. This is useful for when you want to export the
 * union of actions to a reducer that needs to know the set of possible
 * actions that it applies to.
 *
 * @example
 * type Meta = { objectId: string; objectType: string };
 * type Response = string;
 * const postComment = createActionsBuilder<Meta, Response>()(
 *  'POST_COMMENT_PENDING',
 *  'POST_COMMENT_SUCCESS',
 *  'POST_COMMENT_FAILURE',
 * );
 *
 * export type PostCommentActions = ExtractActions<typeof postComment>;
 * //          ^ typed as:
 * //            | PendingAction<'POST_COMMENT_PENDING', Meta>
 * //            | SuccessAction<'POST_COMMENT_SUCCESS', Meta, Response>
 * //            | FailureAction<'POST_COMMENT_FAILURE', Meta>
 */
export type ExtractActions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Builder extends ActionsBuilder<any, any, any, any, any>
> =
  | ReturnType<Builder['actions']>['pending']
  | ReturnType<ReturnType<Builder['actions']>['success']>
  | ReturnType<ReturnType<Builder['actions']>['failure']>;

/**
 * Create a "request pattern" action builder using the given types.
 * Most actions that make API calls as an async side-effect can use
 * this function to generate suitable types and actions.
 *
 * @example
 * const postComment = createActionsBuilder<Meta, Response>()(
 *  'POST_COMMENT_PENDING',
 *  'POST_COMMENT_SUCCESS',
 *  'POST_COMMENT_FAILURE',
 * );
 *
 * // Example consumer
 * const Component = () => {
 *   const dispatch = useThunkDispatch();
 *   const meta = { objectId, objectType };
 *   const { pending, success, failure, request } = postComment.actions(meta);
 *   dispatch(async (d: ThunkDispatch<RootState, unknown, PostCommentActions>) => {
 *     d(pending);
 *     try {
 *       const res = await Promise.resolve('post successful');
 *       d(success(res));
 *     } catch (e) {
 *       d(failure(e));
 *     }
 *   });
 * }
 */
export const createActionsBuilder = <Meta extends object, Response>() => <
  PendingActionType extends string,
  SuccessActionType extends string,
  FailureActionType extends string
>(
  pending: PendingActionType,
  success: SuccessActionType,
  failure: FailureActionType
): ActionsBuilder<
  PendingActionType,
  SuccessActionType,
  FailureActionType,
  Meta,
  Response
> => ({
  types: {
    pending,
    success,
    failure,
  },
  actions(
    meta: Meta
  ): RequestActions<
    PendingActionType,
    SuccessActionType,
    FailureActionType,
    Meta,
    Response
  > {
    return {
      pending: { type: pending, meta },
      success(
        response: Response
      ): SuccessAction<SuccessActionType, Meta, Response> {
        return { type: success, meta, response };
      },
      failure(error: Error): FailureAction<FailureActionType, Meta> {
        return { type: failure, meta, error };
      },
    };
  },
});
