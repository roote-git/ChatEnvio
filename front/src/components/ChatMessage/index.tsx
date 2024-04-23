import "./styles.scss";

export interface ChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt?: Date;
  infoChangeMessage?: boolean;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { text, createdAt, senderName, fromMe, infoChangeMessage } = props;

  console.log(infoChangeMessage);
  if (infoChangeMessage === undefined || infoChangeMessage === false){
    return (
      <>
        {createdAt && (
          <div className={`message ${fromMe ? "sent" : "received"}`}>
            <div className="message__content">
              <div className="message__content__sender">{senderName}</div>
                <div className="message__content__text">{text}</div>
                  <p className="message__content__at">
                    {createdAt && toDateTime(new Date(createdAt).getTime())}
                  </p>
            </div>
          </div>
        )}
      </>
    )
  } else { // Caso seja uma mensagem de alteração de informações do grupo
    return (
      <>
        {createdAt && (
          <div className={"message info"}>
            <div className="message__content">
              <div className="message__content__sender">{senderName}</div>
                <div className="message__content__text">{text}</div>
                  <p className="message__content__at">
                    {createdAt && toDateTime(new Date(createdAt).getTime())}
                  </p>
            </div>
          </div>
        )}
      </>
    )
  };
}

function toDateTime(secs: number) {
  const t = new Date(secs); // Epoc
  const hours = t.getHours();
  const minutes = t.getMinutes();

  return (
    <span>
      {hours > 9 ? hours : <>0{hours}</>}:
      {minutes > 9 ? minutes : <>0{minutes}</>}
    </span>
  );
}
