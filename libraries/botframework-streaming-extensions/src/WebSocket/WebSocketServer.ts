/**
 * @module botframework-streaming-extensions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  CancellationToken,
  IStreamingTransportServer,
  ProtocolAdapter,
  ReceiveResponse,
  RequestHandler,
  StreamingRequest
} from '..';
import { RequestManager } from '../Payloads';
import {
  IPayloadReceiver,
  IPayloadSender,
  PayloadReceiver,
  PayloadSender
} from '../PayloadTransport';
import { ISocket } from './ISocket';
import { WebSocketTransport } from './WebSocketTransport';

/// <summary>
/// A server for use with the Bot Framework Protocol V3 with Streaming Extensions and an underlying WebSocket transport.
/// </summary>
export class WebSocketServer implements IStreamingTransportServer {
  private readonly _url: string;
  private readonly _requestHandler: RequestHandler;
  private readonly _sender: IPayloadSender;
  private readonly _receiver: IPayloadReceiver;
  private readonly _requestManager: RequestManager;
  private readonly _protocolAdapter: ProtocolAdapter;
  private readonly _webSocketTransport: WebSocketTransport;
  private _closedSignal;

  /// <summary>
  /// Initializes a new instance of the <see cref="WebSocketServer"/> class.
  /// </summary>
  /// <param name="socket">The <see cref="ISocket"/> of the underlying connection for this server to be built on top of.</param>
  /// <param name="requestHandler">A <see cref="RequestHandler"/> to process incoming messages received by this server.</param>
  constructor(socket: ISocket, requestHandler?: RequestHandler) {
    this._webSocketTransport = new WebSocketTransport(socket);
    this._requestHandler = requestHandler;

    this._requestManager = new RequestManager();

    this._sender = new PayloadSender();
    this._sender.disconnected = (x: object, y: any) => this.onConnectionDisocnnected(this, x, y);
    this._receiver = new PayloadReceiver();
    this._receiver.disconnected = (x: object, y: any) => this.onConnectionDisocnnected(this, x, y);

    this._protocolAdapter = new ProtocolAdapter(this._requestHandler, this._requestManager, this._sender, this._receiver);
  }

  /// <summary>
  /// Used to establish the connection used by this server and begin listening for incoming messages.
  /// </summary>
  /// <returns>A promise to handle the server listen operation. This task will not resolve as long as the server is running.</returns>
  public async startAsync(): Promise<string> {
    this._sender.connect(this._webSocketTransport);
    this._receiver.connect(this._webSocketTransport);

    return new Promise<string>(resolve =>
      this._closedSignal = resolve);
  }

  /// <summary>
  /// Used to send data over this server connection.
  /// </summary>
  /// <param name="request">The <see cref="StreamingRequest"/> to send.</param>
  /// <param name="cancellationToken">Optional <see cref="CancellationToken"/> used to signal this operation should be cancelled.</param>
  /// <returns>A promise of type <see cref="ReceiveResponse"/> handling the send operation.</returns>
  public async sendAsync(request: StreamingRequest, cancellationToken: CancellationToken): Promise<ReceiveResponse> {
    return this._protocolAdapter.sendRequestAsync(request, cancellationToken);
  }

  /// <summary>
  /// Stop this server.
  /// </summary>
  public disconnect(): void {
    this._sender.disconnect(null);
    this._receiver.disconnect(null);
  }

  private onConnectionDisocnnected(s: WebSocketServer, sender: object, args: any) {
    s._closedSignal('close');
  }
}