/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Menu, Dropdown, message, Modal, Row, Col } from "antd";
import "./styles.scss";
import ChatMessage, { ChatMessageProps } from "../components/ChatMessage";
import { useChat } from "../store/hooks";
import { useDispatch } from "react-redux";
import { initialFetchMessages } from "../store/routines/messages";
import { chatConfig, chatService } from "../api";
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
      message.success("Você está online!");

    };

    const listener = (event: MessageEvent) => {
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

      //Atualiza nome e o ícone do grupo junto ao listener
      (async () => {
        const res = await chatConfig.getGroupName();
        setGroupName(res.groupName);
      })();
      (async () => {
        const res = await chatConfig.getGroupIcon();
        setGroupIcon(res.groupIcon);
      })();

      if (data.type === "heartbeat" || data.message.senderName === nickUsuario)
        return;
      dispatch(chatActions.add({ ...data.message, fromMe: false }));
    };

    socket.addEventListener("message", listener);
    socket.onclose = function () {
      //message.error("Erro ao conectar"); // Ativo somento no Debug
    };
    socket.onerror = function () {
      //message.error("Erro ao conectar"); // Ativo somento no Debug
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

  // Segunda etapa: Utilizando-se de um recurso já existente (mensagens)
  // para criar uma nova funcionalidade, quando altera-se as informações do grupo
  const handleOnGroupInfoChange = async (tipo: string, info: any) => {
    if (tipo === "icon" && dummy.current){
      const data: ChatMessageProps = {
        fromMe: true,
        senderName: nickUsuario,
        text: "ALTEROU O ÍCONE DO GRUPO PARA " + info + ".",
      };
      await chatService.sendMessage(data);
      dummy.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if(tipo === "name" && dummy.current){
      const data: ChatMessageProps = {
        fromMe: true,
        senderName: nickUsuario,
        text: 'ALTEROU O NOME DO GRUPO PARA "' + info + '".',
      };
      await chatService.sendMessage(data);
      dummy.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
  }

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
      
      const data: ChatMessageProps = {
        fromMe: true,
        senderName: nickUsuario,
        text: messageText,
      };

      const res = await chatService.sendMessage(data);
      //dispatch(chatActions.add(res)); // Aparentemente não precisa mais, já que o chat atualiza automaticamnete lendo o back, evita duplicar exibição ao enviar mensagem

      setMessageText("");

      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //Alterar Ícone do Grupo
  const iconesGrupo: string[]= ["✅", "🥳", "😂", "😍", "😱", "🤢", "💀", "🤘", "👑", "🔥", "🌈", "⚽", "🚴", "🎭", "🎮", "❤️", "⚠️", "⛔"];
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [groupIcon, setGroupIcon] = useState(iconesGrupo[0]);
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
    chatConfig.setGroupIcon(icon);
    handleOnGroupInfoChange("icon", icon);
  };

  //Alterar Nome do Grupo
  const [isModalVisible, setIsTitleModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("Grupo Sem Nome");
  const [newGroupName, setNewGroupName] = useState("");
  const showTitleModal = () => {
    setIsTitleModalVisible(true);
  };
  const handleOk = () => {
    setGroupName(newGroupName);
    setIsTitleModalVisible(false);
    chatConfig.setGroupName(newGroupName);
    handleOnGroupInfoChange("name", newGroupName);
  };
  const handleCancel = () => {
    setIsTitleModalVisible(false);
  };

  // Segunda Etapa: Correção de uma falha e implementação de uma melhoria funcional, 
  // onde, mesmo com o nick indisponível para escolher, permitia temporariamente as 
  // mensagens como se o usuário atual tivesse enviado, pois, o nick tinha sido utilizado
  // anteriormente. Exemplo no readme.md
  
  //Alterar Nick do Usuário
  const [isNickModalVisible, setIsNickModalVisible] = useState(true);
  const [nickUsuario, setNickUsuario] = useState("Anônimo");
  const [isNickValid, setIsNickValid] = useState(false);
  const [nickMessage, setNickMessage] = useState("Crie um nick único para continuar!");
  const [nickTemp, setNickTemp] = useState("Anônimo");
  const showNickModal = () => {
    setIsNickModalVisible(true);
  };
  const handleNickOk = () => {
    setNickUsuario(nickTemp);
    setIsNickModalVisible(false);
  };
  const onNickChange = (event: any) => {
    const newNick = event.target.value;
    setNickTemp(newNick);
    
    // Verifique se o novo nome de usuário já foi usado, ignorando a verificação "case sensitive"
    const isNickUsed = messages.some(msg => msg.senderName.toLowerCase() === newNick.toLowerCase());

    const getNickStatus = () => {
      if (isNickUsed) return "utilizado";
      if (newNick === undefined) return "indefinido";
      if (newNick === "") return "vazio";
      if (newNick.includes(" ")) return "temEspaco";
      return "valid";
    };

    // Segunda etapa: melhoria na verificação do nick e feedback ao usuário
    switch (getNickStatus()) {
      case "utilizado": setNickMessage("Nick já utilizado."); setIsNickValid(false); break;
      case "indefinido": setNickMessage("Nick indefinido."); setIsNickValid(false); break;
      case "vazio": setNickMessage("Nick não pode ser vazio."); setIsNickValid(false); break;
      case "temEspaco": setNickMessage("Nick não pode ter espaço."); setIsNickValid(false); break;
      case "valid": setNickMessage("Nick disponível!"); setIsNickValid(true); break;
      default: setNickMessage("Nick inválido."); setIsNickValid(false); break;
    }
  };

  //Balão informativo
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };
  const handleInfoOk = () => {
    setIsInfoModalVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={showTitleModal}>
        Editar nome do Grupo
      </Menu.Item>
      <Menu.Item key="2" onClick={showIconModal}>
        Mudar Ícone do Grupo
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={showNickModal}>
        Trocar Username
      </Menu.Item>
    </Menu>
  );

  //Envia mensagem ao pressionar Enter
  const handleKeyPress = (event: any) => {
      if (messageText.trim())
        handleCreateMessage(event);
  };


  return (
    <>
      <div className="chat-container">
        <div className="chat-container__background">
          <header style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="image" >
              <h1>{groupIcon}</h1> 
            </div>
            <div>
              {groupName}
            </div>
            <div>
              <Dropdown.Button
              onClick={showInfoModal}
                style={{ width: 50 }}
                overlay={menu}
              >ℹ</Dropdown.Button>
            </div>
          </header>

          <Modal title="Alterar ícone do grupo" visible={isIconModalVisible} onOk={handleIconOk} onCancel={handleIconCancel}>
            <Row gutter={16}>
              {iconesGrupo.map((icon, index) => (
                <Col key={index} span={4}>
                  <div onClick={() => handleIconClick(icon)}>
                    {icon}
                  </div>
                </Col>
              ))}
            </Row>
          </Modal>
          
          <Modal title="Alterar nome do grupo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input placeholder="Insira o novo nome do grupo..." onChange={(e) => setNewGroupName(e.target.value)} />
          </Modal>
          
          <Modal title="Escolha seu usuário" visible={isNickModalVisible} footer={null}>
            <Input placeholder="Digite seu nome de usuário..." onChange={onNickChange} />
            <div style={{ color: isNickValid ? "green" : "red" }}>{nickMessage}</div>
            <div>
              <Button type="primary" onClick={handleNickOk} disabled={!isNickValid}>
                OK
              </Button>
            </div>
          </Modal>

          <Modal title="Como funciona" visible={isInfoModalVisible} onOk={handleInfoOk} onCancel={handleInfoOk}>
            <p>Este é um aplicativo de chat randomico em tempo real.</p>
            <p>Você pode enviar e receber mensagens com diversas pessoas simultaneamente.</p>
            <p>Para começar, escolha um nome de usuário.</p>
            <p>Ele será exclusivamente seu pelo tempo que permanecer nessa tela.</p>
            <p>Depois disso, nunca mais outra pessoa vai poder usá-lo nesse mesmo grupo.</p>
            <p>Seja respeitoso com os demais e divirtam-se!</p>
          </Modal>

          

          <main>
            <div>
              {messages.map((msg, index) => {
                const { senderName, text, createdAt } = msg;
                return (
                  <ChatMessage
                    key={index}
                    fromMe={senderName === nickUsuario}
                    senderName={senderName === nickUsuario ? nickUsuario : senderName}
                    //text = {text.startsWith("Alterou o ") === ? }
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
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
