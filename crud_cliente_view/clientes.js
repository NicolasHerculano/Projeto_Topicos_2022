/*
 * Arquivo JavaScript para acessar a API de Veiculos,
 * exibindo e manipulando os dados do DOM da página HTML
 */

//Constantes
const ALTERAR = 1;
const EXCLUIR = 2;

const URL_API = "http://localhost:8080/Veiculos"

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const IDX_STORAGE_ID = 'idVeiculo';
const IDX_STORAGE_MSG_SUCESSO = 'msgSucesso';
const IDX_STORAGE_MSG_ERRO = 'msgErro';

//Função para carregar a lista de Veiculos da API
function carregarVeiculos() {
    //console.log("Teste");
    //Carregar os Veiculos a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", URL_API, false);
    xhttp.send();

    var retorno = xhttp.responseText;
    //console.log(retorno);
    var Veiculos = JSON.parse(retorno);

    var tabela = document.getElementById('tblVeiculos');
    
    //Remover o body na tabela caso exista
    var corpo = tabela.getElementsByTagName('tbody');
    if(corpo && corpo.length > 0)
        tabela.removeChild(corpo[0]);
    
    //Criar o body na tabela
    corpo = document.createElement('tbody');
    tabela.appendChild(corpo);

    //Criar as linhas com os Veiculos
    for(var i=0; i<Veiculos.length; i++) {
        var linha = corpo.insertRow();
        linha.insertCell().innerHTML = Veiculos[i].nome;
        linha.insertCell().innerHTML = Veiculos[i].email;
        linha.insertCell().innerHTML = Veiculos[i].telefone;
        var botao = criarBotao("Alterar", "btn btn-primary", 
            ALTERAR, Veiculos[i].id);
        linha.insertCell().appendChild(botao);
        var botao2 = criarBotao("Excluir", "btn btn-danger", 
            EXCLUIR, Veiculos[i].id);
        linha.insertCell().appendChild(botao2);
    }
    
}

//Função para carregar os dados de um único Veiculo a partir da API
function carregarDadosVeiculo() {
    
}

//Função para iniciar a inclusão de um Veiculo
function incluirVeiculo() {
    window.location = "Veiculos_form.html";
}

//Função para iniciar a alteração de um Veiculo
function alterarVeiculo(id) {
    window.location = 'Veiculos_form.html';
}

//Função para salvar um Veiculo (inclusão ou alteração)
function salvarVeiculo() {  
    //Capturar os valores do formulário e criar o JSON para enviar a API
    var nome = document.getElementById('txtNome').value;
    var email = document.getElementById('txtEmail').value;
    var fone = document.getElementById('txtTelefone').value;

    var Veiculo = { "nome": nome,
                    "email": email,
                    "telefone": fone };

    //Salvar o Veiculo a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', URL_API, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(Veiculo));

    if(xhttp.status == STATUS_CREATED) {
        window.location = 'Veiculos_listar.html';
    } else {
        var msg = retornaMsgErro(xhttp.responseText);

        //Exibe a mensagem de erro na tela
        var divErro = document.getElementById('divErro');
        divErro.innerHTML = msg;
        divErro.style.display = 'block';
    }
    
}

//Função para excluir um Veiculo
function excluirVeiculo(id) {
    //Confirma a exclusão
    if(! confirm('Confirma a exclusão do Veiculo?'))
        return;

    var xhttp = new XMLHttpRequest();
    var url = URL_API + "/" + id;
    xhttp.open("DELETE", url, false);
    xhttp.send();

    if(xhttp.status == STATUS_OK) {
        carregarVeiculos(); //Recarrega a tabela de Veiculos
        var divMsg = document.getElementById('divSucesso');
        divMsg.innerHTML = "Veiculo excluído com sucesso!";
        divMsg.style.display = "block";
    } else {
        var divMsg = document.getElementById('divErro  ');
        divMsg.innerHTML = "Erro na exclusão do Veiculo.";
        divMsg.style.display = "block";
    }
}

//Função AUXILIAR que cria um botão no HTML
function criarBotao(texto, classeEstilo, acao, id) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = texto;
    btn.className = classeEstilo;
    
    if(acao == ALTERAR)
        btn.addEventListener("click", function() {
            alterarVeiculo(id);
        });
    else if(acao == EXCLUIR)
        btn.addEventListener("click", function() {
            excluirVeiculo(id);
        });

    return btn;
}

//Função AUXILIAR para retornar uma mensagem de erro extraida de um JSON
function retornaMsgErro(jsonErro) {
    var objErro = JSON.parse(jsonErro);
    return objErro.titulo;
}

//Função AUXILIAR para exibir uma mensagem em um componente HTML da tela
function exibeMsgTela(idComponente, mensagem) {
    document.getElementById(idComponente).innerHTML = mensagem;
    document.getElementById(idComponente).style.display = "block";    
}
