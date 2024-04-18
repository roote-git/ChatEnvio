/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Menu, Dropdown, message, Modal, Row, Col } from "antd";
import "./styles.scss";
import ChatMessage, { ChatMessageProps } from "../components/ChatMessage";
import { useChat } from "../store/hooks";
import { useDispatch } from "react-redux";
import { initialFetchMessages } from "../store/routines/messages";
import { chatService } from "../api";
import { chatActions } from "../store/features/messages";
import { url } from "../api";


export default function ChatRoom() {
  const [messageText, setMessageText] = useState("");
  const { messages, randomName } = useChat();
  const dispatch = useDispatch();

  // TODO
  /**
   * Agora, é hora de aprimorar o armazenamento das mensagens! Atualmente,
   * o ChatEnvio está registrando suas mensagens no estado do componente,
   * o que não é ideal para uma aplicação destinada a atender milhares de usuários.
   * Recomendo que adote uma abordagem mais escalável,
   * como utilizar um gerenciador de estado como o Redux.
   * Isso proporcionará uma gestão mais eficiente e otimizada das mensagens,
   * garantindo um desempenho superior à medida que a aplicação cresce em escala.
   */

  //AntonioVini47: Feito no BACK com insertMessage()

  // const [messages, setMessages] = useState<Array<ChatMessageProps>>([]);
  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://" + url);

    const heartbeat = () => {
      if (!socket) return;
      if (socket.readyState !== 1) return;
      socket.send(JSON.stringify({ ping: "Pong" }));
      setTimeout(heartbeat, 10000);
    };

    socket.onopen = function () {
      heartbeat();
      message.success("Seu chat está conectado!");
    };
    const listener = (event: MessageEvent) => {
      message.success("Listener acionado!");
      const data = JSON.parse(event.data);
      // TODO addNewMessage
      /**
       *
       * É hora de sintonizar os eventos no WebSocket!
       * Implemente uma lógica de listener para capturar os eventos enviados pelo backend,
       * adicionando as mensagens ao chat em tempo real. Essa implementação garantirá uma
       * experiência dinâmica e instantânea, permitindo que as mensagens sejam exibidas no
       * chat assim que forem recebidas do backend.
       *
       */
      //AntonioVini47: Feito no BACK

      if (data.type === "heartbeat" || data.message.senderName === randomName)
        return;
      dispatch(chatActions.add({ ...data.message, fromMe: false }));
    };

    socket.addEventListener("message", listener);
    socket.onclose = function () {
      message.error("Erro ao conectar (onclose) ❌");
    };
    socket.onerror = function () {
      message.error("Erro ao conectar (onerror) ❌");
    };

    return () => {
      socket?.close();
    };
  }, [randomName]);

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(initialFetchMessages());
  }, []);

  const handleMessageOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setMessageText(event.target.value);
  };

  const handleCreateMessage = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (messageText && dummy.current) {
      // TODO sendMessage
      /**
       * 
        Desenvolva a lógica de envio da nova mensagem para o backend. 
        Essa implementação garantirá que as mensagens enviadas sejam processadas de forma eficiente, 
        permitindo uma comunicação contínua e confiável entre o frontend e o backend.
       */
      
  //AntonioVini47: Feito no BACK com insertMessage()
      const data: ChatMessageProps = {
        fromMe: true,
        senderName: randomName,
        text: messageText,
      };

      const res = await chatService.sendMessage(data);
      dispatch(chatActions.add(res));

      setMessageText("");

      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [groupIcon, setGroupIcon] = useState("👥");
  const iconesGrupo: string[]= ["🥳", "😂", "😍", "😱", "🤢", "💀", "🤘", "👑", "🔥", "🌈", "⚽", "🚴", "🎭", "🎮", "❤️", "✅", "⚠️", "⛔"];

  const showIconModal = () => {
    setIsIconModalVisible(true);
  };
  
  const handleIconOk = () => {
    setIsIconModalVisible(false);
  };
  
  const handleIconCancel = () => {
    setIsIconModalVisible(false);
  };
  
  const handleIconClick = (icon) => {
    setGroupIcon(icon);
    setIsIconModalVisible(false);
  };

  const [isModalVisible, setIsTitleModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("Grupo Inicial");
  const [newGroupName, setNewGroupName] = useState("");

  const showTitleModal = () => {
    setIsTitleModalVisible(true);
  };

  const handleOk = () => {
    setGroupName(newGroupName);
    setIsTitleModalVisible(false);
  };

  const handleCancel = () => {
    setIsTitleModalVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={showTitleModal}>
        Editar nome do Grupo
      </Menu.Item>

      <Menu.Item key="2" onClick={showIconModal}>
        Mudar Ícone do Grupo
      </Menu.Item>
      <Menu.Item key="3" onClick={() => {}}>
        Mudar seu Nick
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={() => {}}>
        Sair do Grupo
      </Menu.Item>
    </Menu>
  );

  
  const executaDebug = async () => {
    message.info("Botão Debug executado");
  }

  const handleKeyPress = (event: any) => {
      if (messageText.trim())
        handleCreateMessage(event);
  };

  const [nickUsuario, setNickUsuario] = useState("Antonio");

  const onNickChange = (event: any) => {
    message.info("Nick alterado para: " + event.target.value);
    setNickUsuario(event.target.value);
  }


  return (
    <>
      <div className="chat-container">
        <div className="chat-container__background">

          <header style={{ display: "flex", justifyContent: "space-between" }}>
            <Modal title="Alterar ícone do grupo" visible={isIconModalVisible} onOk={handleIconOk} onCancel={handleIconCancel}>
              <Row gutter={16}>
                {iconesGrupo.map((icone, index) => (
                  <Col key={index} span={4}>
                    <div onClick={() => handleIconClick(icone)}>
                      {icone}
                    </div>
                  </Col>
                ))}
              </Row>
            </Modal>
            <div className="image"><h2>{groupIcon}</h2></div>
            
            {groupName}

            <Modal title="Alterar nome do grupo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <Input placeholder="Insira o novo nome do grupo" onChange={(e) => setNewGroupName(e.target.value)} />
            </Modal>

            <Dropdown.Button
              style={{ width: 50 }}
              overlay={menu}
            ></Dropdown.Button>
          </header>

          <main>
            <div>
              {messages.map((msg, index) => {
                const { senderName, text, createdAt } = msg;
                return (
                  <ChatMessage
                    key={index}
                    fromMe={senderName === randomName}
                    senderName={senderName === randomName ? nickUsuario : senderName}
                    text={text}
                    createdAt={createdAt}
                  />
                );
              })}
              <div ref={dummy} />
            </div>
          </main>

          <footer>
            <form onSubmit={(e) => e.preventDefault()}>
              <Input
                type="text"
                value={messageText}
                placeholder="Digite uma mensagem..."
                onChange={handleMessageOnChange}
                onPressEnter={handleKeyPress}
              />
              <Button onClick={handleCreateMessage}>Enviar</Button>
              Nick: <Input
                type="text"
                placeholder="Escolha um nick..."
                onChange={onNickChange}
              />
            <button onClick={executaDebug}>DEBUG</button>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
