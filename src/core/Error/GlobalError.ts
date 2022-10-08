import {NotAuthorizedError, NotFoundLinkedAccounts} from './AuthError';
import {CancellationError} from './CancellablePromiseError';
import {JsonStringifyError, JsonParseError} from './JsonError';
import {JwtParseError} from './JwtError';
import {
  KeyValueStoreDeleteError,
  KeyValueStoreGetError,
  KeyValueStoreSetError,
} from './KeyValueStoreError';
import {UnknownError} from './UnknownError';
import {UserCancellationError} from './UserError';
import {NetworkError} from './NetworkError';
import {GeneralRestClientError} from './RestClientError';
import {DecodeError, EncodeError} from './EncodingError';
import {TimeoutError} from './TimeoutError';
import {
  CookieDeleteError,
  CookieGetError,
  CookieSetError,
  NotFoundSavedInstagramCookies,
} from './CookieError';
import {GetInstagramDataError, InstagramUnknownError} from './InstagramError';

export type GlobalError =
  | NotAuthorizedError
  | CancellationError
  | EncodeError
  | DecodeError
  | JsonStringifyError
  | JsonParseError
  | JwtParseError
  | KeyValueStoreDeleteError
  | KeyValueStoreGetError
  | KeyValueStoreSetError
  | NetworkError
  | GeneralRestClientError
  | UnknownError
  | TimeoutError
  | UserCancellationError
  | CookieDeleteError
  | CookieSetError
  | CookieGetError
  | NotFoundSavedInstagramCookies
  | InstagramUnknownError
  | GetInstagramDataError
  | NotFoundLinkedAccounts;
