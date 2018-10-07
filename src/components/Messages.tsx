import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Message } from "./Message";

interface IProps extends RouteComponentProps<{ conversation_id: string }> {
  refreshConversations: () => void;
  socket: SocketIOClient.Socket;
}

interface IState {
  error: string;
  loading: boolean;
  messages: IMessage[];
  current_user: string;
}

const initialState = {
  current_user: "",
  error: "",
  loading: true,
  messages: []
};

class Messages extends React.Component<IProps, IState> {
  public container: HTMLDivElement;
  public messagesBottom: HTMLDivElement;

  constructor(props: IProps) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount() {
    this.props.socket.emit("authenticate", {
      conversation_id: this.props.match.params.conversation_id,
      token: localStorage.getItem("token")
    });
    this.props.socket.on(
      "new message",
      ({
        messages,
        current_user
      }: {
        messages: IMessage[];
        current_user: string;
      }) => {
        this.setState({ messages, loading: false, current_user }, () => {
          this.container.scrollTo(0, this.messagesBottom.offsetTop);
        });
        this.props.refreshConversations();
      }
    );

    this.props.socket.on("unauthorized", () => {
      this.setState({
        error: "Could not load messages. Please try logging in again."
      });
    });
  }

  public componentWillUnmount() {
    this.props.socket.off("new message");
    this.props.socket.off("unauthorized");
  }

  public createContainerRef = (element: HTMLDivElement) =>
    (this.container = element);
  public createBottomRef = (element: HTMLDivElement) =>
    (this.messagesBottom = element);

  public render() {
    return this.state.error ? (
      <p className="error">{this.state.error}</p>
    ) : (
      <React.Fragment>
        <div className="messages-header">
          {!this.state.messages.length &&
            !this.state.loading &&
            "No messages yet"}
          {this.state.loading && "Loading messages..."}
          {!!this.state.messages.length &&
            this.state.messages[0].users.reduce(
              (acc, user, i, arr) =>
                i !== arr.length - 1 ? `${acc} ${user},` : `${acc} ${user}`,
              ""
            )}
        </div>
        <div ref={this.createContainerRef} className="messages-list">
          {this.state.messages.map(message => (
            <Message key={message.message_id} {...message} />
          ))}

          <div
            ref={(element: HTMLDivElement) => (this.messagesBottom = element)}
          />
        </div>
      </React.Fragment>
    );
  }
}

export { Messages };
