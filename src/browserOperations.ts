import Protocol from 'devtools-protocol';

export abstract class BrowserOperations {
  abstract grantPermissions(
    grantPermissionRequest: Protocol.Browser.GrantPermissionsRequest
  ): Promise<void>;
}
