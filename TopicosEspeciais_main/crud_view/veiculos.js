/*
 * Arquivo JavaScript para acessar a API de veiculos,
 * exibindo e manipulando os dados do DOM da página HTML
 */

//Constantes
const ALTERAR = 1;
const EXCLUIR = 2;

const URL_API = "http://localhost:8080/veiculos"

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const IDX_STORAGE_ID = 'idVeiculo';
const IDX_STORAGE_MSG_SUCESSO = 'msgSucesso';
const IDX_STORAGE_MSG_ERRO = 'msgErro';

//Função para carregar a lista de veiculos da API
function carregarVeiculos() {
    //console.log("Teste");
    //Carregar os veiculos a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", URL_API, false);
    xhttp.send();

    var retorno = xhttp.responseText;
    //console.log(retorno);
    var veiculos = JSON.parse(retorno);

    var tabela = document.getElementById('tblVeiculos');
    
    //Remover o body na tabela caso exista
    var corpo = tabela.getElementsByTagName('tbody');
    if(corpo && corpo.length > 0)
        tabela.removeChild(corpo[0]);
    
    //Criar o body na tabela
    corpo = document.createElement('tbody');
    tabela.appendChild(corpo);

    //Criar as linhas com os veiculos
    for(var i=0; i<veiculos.length; i++) {
        var linha = corpo.insertRow();
        linha.insertCell().innerHTML = veiculos[i].placa;
        linha.insertCell().innerHTML = veiculos[i].modelo;
        linha.insertCell().innerHTML = veiculos[i].fabricante;
        linha.insertCell().innerHTML = veiculos[i].anoFabricacao;

        console.log(veiculos[i])

        var botao = criarBotao("Alterar", "btn btn-primary", 
            ALTERAR, veiculos[i].id);
        linha.insertCell().appendChild(botao);
        var botao2 = criarBotao("Excluir", "btn btn-danger", 
            EXCLUIR, veiculos[i].id);
        linha.insertCell().appendChild(botao2);
    }
    
}

//Função para carregar os dados de um único veiculo a partir da API
//Esta função é somente necessária para a ALTERAÇÃO
function carregarDadosVeiculos() {
    var id = localStorage.getItem(IDX_STORAGE_ID);

    if(id) { //Se encontrou o ID, é uma alteração
        //Carregar os veiculos a partir da API
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", URL_API + "/" + id, false);
        xhttp.send();

        //Seta os dados do veiculo para o formulário
        var retorno = xhttp.responseText;
        var veiculo = JSON.parse(retorno);
        document.getElementById("txtPlaca").value = veiculo.placa;
        document.getElementById("txtModelo").value = veiculo.modelo;
        document.getElementById("txtFabricante").value = veiculo.fabricante;
        document.getElementById("txtAnoFabricacao").value = veiculo.anoFabricacao;
    }
}

//Função para iniciar a inclusão de um veiculo
function incluirVeiculo() {
    localStorage.removeItem(IDX_STORAGE_ID); //Necessário para a ALTERAÇÃO
    window.location = "veiculos_form.html";
}

//Função para iniciar a ALTERAÇÃO de um veiculo
function alterarVeiculo(id) {
    localStorage.setItem(IDX_STORAGE_ID, id);
    window.location = 'veiculos_form.html';
}

//Função para salvar um veiculo (inclusão ou alteração)
function salvarVeiculo() {
    //Capturar os valores do formulário e criar o JSON para enviar a API
    var placa = document.getElementById('txtPlaca').value;
    var modelo = document.getElementById('txtModelo').value;
    var fabricante = document.getElementById('txtFabricante').value;
    var anoFabricacao = document.getElementById('txtAnoFabricacao').value;

    var veiculo = { "placa": placa,
                    "modelo": modelo,
                    "fabricante": fabricante,
                    "anoFabricacao": anoFabricacao
                 };

    var url = URL_API;
    var method = 'POST';
    
    //Bloco necessário para a ALTERAÇÃO
    var id = localStorage.getItem(IDX_STORAGE_ID);
    if(id) {
        url = url + "/" + id;
        method = "PUT";
    }

    //Salvar o veiculo a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open(method, url, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(veiculo));

    if(xhttp.status == STATUS_CREATED || xhttp.status == STATUS_OK) {
        window.location = 'veiculos_listar.html';
    } else {
        var msg = retornaMsgErro(xhttp.responseText);

        //Exibe a mensagem de erro na tela
        var divErro = document.getElementById('divErro');
        divErro.innerHTML = msg;
        divErro.style.display = 'block';
    }
}

//Função para excluir um veiculo
function excluirVeiculo(id) {
    //Confirma a exclusão
    if(! confirm('Confirma a exclusão do veiculo?'))
        return;

    //Exclui o veiculo a partir da API
    var xhttp = new XMLHttpRequest();
    var url = URL_API + "/" + id;
    xhttp.open("DELETE", url, false);
    xhttp.send();

    if(xhttp.status == STATUS_OK) {
        carregarVeiculos(); //Recarreca da tabela de veiculos
        var divMsg = document.getElementById('divSucesso');
        divMsg.innerHTML = "Veiculo excluído com sucesso.";
        divMsg.style.display = "block";
    } else {
        var divMsg = document.getElementById('divErro');
        divMsg.innerHTML = "Erro na exclusão do veiculo.";
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
