//Módulo 4 deverá acrescentar duas novas funcionalidades ao nosso projeto
// Exibir a data do último acesso do usuário (cookies) cookies = biscoitos
// Autenticar o usuário para controlar o acesso aos recursos da aplicação (sessão)

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const porta = 3000;
const host = '0.0.0.0';

var listaUsuarios = [];

function processarCadastroUsuario(requisicao, resposta) {
    // extrair os dados do corpo da requisição, além de validar os dados
    const dados = requisicao.body;
    let conteudoResposta = '';
    //é necessário validar os dados enviados
    //A validação dos dados é de responsabilidade da aplicação servidora
    if (!(dados.nome && dados.sobrenome && dados.nomeUsuario
        && dados.cidade && dados.uf && dados.cep)) {
        //estão faltando dados do usuário!
        conteudoResposta = `
        <!DOCTYPE html>
        <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>

        <body>
            <div class="container">
                <form action='/cadastrarUsuario' method='POST' class="row g-3 needs-validation" novalidate>
                    <fieldset class="border p-2">
                    <legend class="mb-3">Cadastro de usuário</legend>
                    <div class="col-md-4">
                        <label for="" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nome" name="nome" value="${dados.nome}" required>
                    </div>
        `;
        if (!dados.nome) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe o nome!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="col-md-4">
                        <label for="sobrenome" class="form-label">Sobrenome</label>
                        <input type="text" class="form-control" id="sobrenome" name="sobrenome" value="${dados.sobrenome}" required>
                    </div>`;
        if (!dados.sobrenome) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe o sobrenome!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="col-md-4">
                        <label for="nomeUsuario" class="form-label">Nome do usuário</label>
                        <div class="input-group has-validation">
                            <span class="input-group-text" id="inputGroupPrepend">@</span>
                            <input type="text" class="form-control" id="nomeUsuario" name="nomeUsuario" value="${dados.nomeUsuario}"
                            aria-describedby="inputGroupPrepend" required>
                        </div>
                    </div>
        `;
        if (!dados.nomeUsuario) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe o nome de usuário!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="col-md-6">
                        <label for="cidade" class="form-label">Cidade</label>
                        <input type="text" class="form-control" id="cidade" name="cidade" value="${dados.cidade}" required>
                    </div>`;
        if (!dados.cidade) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe a cidade!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="col-md-3">
                        <label for="uf" class="form-label">UF</label>
                        <select class="form-select" id="uf" name="uf" value="${dados.uf}" required>
                            <option selected disabled value="">Escolha um estado...</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                        </select>
                    </div>`;
        if (!dados.uf) {
            conteudoResposta +=
                `<div>
                    <p class="text-danger">Por favor, informe o estado!</p>
                </div>`;
        }
        conteudoResposta+=`
                <div class="col-md-3">
                    <label for="cep" class="form-label">CEP</label>
                    <input type="text" class="form-control" id="cep" name="cep" value="${dados.cep}" required>
                </div>
        `;
        if (!dados.cep) {
            conteudoResposta +=
                `<div>
                    <p class="text-danger">Por favor, informe o CEP!</p>
                </div>`;
        }
        conteudoResposta += `
                <div class="col-12 mt-2">
                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                </div>
                </fieldset>
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
        </body>
        </html>`;
        resposta.end(conteudoResposta);

    }
    else {
        const usuario = {
            nome: dados.nome,
            sobrenome: dados.sobrenome,
            nomeUsuario: dados.nomeUsuario,
            cidade: dados.cidade,
            uf: dados.uf,
            cep: dados.cep
        }
        //adiciona um novo usuário na lista de usuários já cadastrados
        listaUsuarios.push(usuario);
        //retornar a lista de usuários
        conteudoResposta = `
    <!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <title>Menu do sistema</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body>
        <h1>Lista de usuário cadastrados</h1>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Sobronome</th>
                    <th>Nome de usuário</th>
                    <th>Cidade/UF</th>
                    <th>CEP</th>
                </tr>
            </thead>
            <tbody> `;

        for (const usuario of listaUsuarios) {
            conteudoResposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.sobrenome}</td>
                        <td>${usuario.nomeUsuario}</td>
                        <td>${usuario.cidade}/${usuario.uf}</td>
                        <td>${usuario.cep}</td>
                    <tr>
                `;
        }

        conteudoResposta += `
            </tbody>
        </table>
        <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
        <a class="btn btn-primary" href="/cadastraUsuario.html" role="button">Continuar cadastrando</a>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>

    </html>`;
        resposta.end(conteudoResposta);
    }//fim do if/else 
}

//pseudo middleware
function autenticar(requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect("/login.html");
    }
}
const app = express();
//ativando a funcionalidade de manipular cookies
app.use(cookieParser());

//adicionar uma nova capacidade para essa aplicação: Memorizar com quem o servidor está falando
//durante o uso do sistema, a aplicação saberá, dentro de uma sessão válida, com quem ela se comunica.
app.use(session({
    secret:"M1nH4Ch4v3S3cR3t4",
    resave: true, //atualiza a sessão mesmo que não há alterações a cada requisição
    saveUninitialized: true,
    cookie: {
        //tempo de vida da sessão
        maxAge: 1000 * 60 * 15 //15 minutos
    }
}));


//ativar a extensão que manipula requisisões HTTP
//opção false ativa a extensão querystring
//opção true ativa a extensão qs (manipula objetos (lista, aninhados))
app.use(express.urlencoded({ extended: true }));

//indicando para a aplicação como servir arquivos estáticos localizados na pasta 'paginas'
app.use(express.static(path.join(process.cwd(), 'paginas')));

app.get('/',autenticar, (requisicao, resposta) => {
    const dataUltimoAcesso = requisicao.cookies.DataUltimoAcesso;
    const data = new Date();
    resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });
    resposta.end(`
        <!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
                <title>Menu do sistema</title>
            </head>
            <body>
                <h1>MENU</h1>
                <ul>
                    <li><a href="/cadastraUsuario.html">Cadastrar Usuário</a></li>
                </ul>
            </body>
            <footer>
                <p>Seu último acesso foi em ${dataUltimoAcesso}</p>
            </footer>
        </html>
    `);
})

//endopoint login que irá processar o login da aplicação
app.post('/login', (requisicao, resposta)=>{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario && senha && (usuario === 'renato') && (senha === '123')){
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/');
    }
    else{
        resposta.end(`
            <!DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <title>Falha na autenticação</title>
                </head>
                <body>
                    <h3>Usuário ou senha inválidos!</h3>
                    <a href="/login.html">Voltar ao login</a>
                </body>
            </html>
        `);
    }
});

//rota para processar o cadastro de usuários endpoint = '/cadastrarUsuario'
app.post('/cadastrarUsuario',autenticar, processarCadastroUsuario);

app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});


