//Eu cheguei a elaborar alguns testes para a camada de service, mas não cheguei a roda-los
import { expect } from "chai";
import sinon from "sinon";
import { Model } from "mongoose";
import { sendMessage, getAllMessages } from "../../../src/Services/messageService";
import { mocheObjectListReturn, mocheObjectInsert, mocheObjectAfterInsert } from "../../moche/mocheServices";

describe("Deveria mandar uma mensagem", () => {
  it("A função sendMessage deveria inserir uma mensagem com SUCESSO e retorna-la com o id", async () => {
    sinon.stub(Model, "create").resolves(mocheObjectAfterInsert);
    const result = await sendMessage(mocheObjectInsert);
    expect(result).to.be.deep.equal(mocheObjectAfterInsert);
  })

  it("A função sendMessage deveria retornar Null se acontecer algum erro", async () => {
    sinon.stub(Model, "create").throwsException();
    const result = await sendMessage(mocheObjectInsert);
    expect(result).to.be.null;
  })

  it("A função getAllMessages deveria retornar todas as mensagens em caso de SUCESSO", async () => {
    sinon.stub(Model, "find").resolves(mocheObjectListReturn);
    const result = await getAllMessages();
    expect(result).to.be.instanceOf(Array);
    expect(result).to.be.deep.equal(mocheObjectListReturn);
  })

  it("A função getAllMessages deveria retornar Null se acontecer algum erro", async () => {
    sinon.stub(Model, "find").throwsException();
    const result = await getAllMessages();
    expect(result).to.be.null;
  })
})