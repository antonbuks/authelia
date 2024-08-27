/**
 * The {@link RegExp} pattern of the authority of a URI.
 *
 * @private
 * @type {string}
 */
export const _URI_AUTHORITY_PATTERN = "(//[^/?#]+)";

/**
 * The {@link RegExp} pattern of the path of a URI.
 *
 * @private
 * @type {string}
 */
export const _URI_PATH_PATTERN = "([^?#]*)";

/**
 * The {@link RegExp} pattern of the protocol of a URI.
 *
 * FIXME: The URL class exposed by JavaScript will not include the colon in
 * the protocol field. Also in other places (at the time of this writing:
 * the DeepLinkingMobilePage.js) the APP_LINK_SCHEME does not include
 * the double dots, so things are inconsistent.
 *
 * @type {string}
 */
export const URI_PROTOCOL_PATTERN = "^([a-z][a-z0-9\\.\\+-]*:)";
