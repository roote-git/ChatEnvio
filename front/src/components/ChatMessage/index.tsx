import "./styles.scss";

export interface ChatMessageProps {
  text: string;
  fromMe: boolean;
  senderName: string;
  createdAt?: Date;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { text, createdAt, senderName, fromMe } = props;

  /**
   * TODO
   * 
   *Desenvolva a lógica para exibir as mensagens de ambos os participantes do chat! 
   Duas classes CSS já estão prontas para uso: .sent e .received. Adicione dinamicamente a 
   classe correspondente com base no valor da propriedade fromMe e aplique-a à primeira div do balão de mensagem. 
   Isso proporcionará uma formatação diferenciada, indicando visualmente se a 
   mensagem foi enviada ou recebida, melhorando a clareza na identificação das interações no chat.
   * 
   */

  return (
    <>
      {createdAt && (
        <div className={`message ${fromMe === true ? "sent" : "received"}`}>
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
  );
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
