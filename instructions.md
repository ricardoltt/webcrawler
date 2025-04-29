# Documentação do Projeto de Teste Asksuite

## Visão Geral do Projeto
Este projeto é uma aplicação de web scraping que busca quartos de hotel com base em datas de check-in e check-out. Utiliza Puppeteer para web scraping e Express.js para a API.

## Estrutura do Projeto
```
├── controllers/
│   └── BrowserController.js
├── middlewares/
│   ├── LoggerMiddleware.js
│   └── ValidationMiddleware.js
├── routes/
│   └── router.js
├── services/
│   └── BrowserService.js
├── utils/
│   ├── PriceHelper.js
│   └── ValidationSchemas.js
├── __tests__/
│   ├── controllers/
│   │   └── BrowserController.test.js
│   ├── services/
│   │   └── BrowserService.test.js
│   ├── middlewares/
│   │   └── ValidationMiddleware.test.js
│   ├── routes/
│   │   └── router.test.js
│   └── utils/
│       ├── PriceHelper.test.js
│       └── ValidationSchemas.test.js
├── app.js
├── server.js
└── package.json
```

## Modificações Implementadas
Procurei seguir o padrão que já existia no teste, com pascal case para o nome dos arquivos, Browser para o nome da nossa entidades
e obter o retorno conforme o README e os prints. Para facilitar a correção do objetivo do teste, tentei implementar apenas o requisitado, porém
mapeei algumas melhorias que informo nesse documento.

Adicionei testes com Jest e Supertest, e Zod para validação dos dados, para aumentar a segurança das informações e dar mais informações ao usuário sobre a data repassada.

Adicionei também uma collection do postman para importar as rotas.

## Executando os Testes
```bash
npm test
```

## Executando a Aplicação
```bash
npm run dev
```

## Melhorias Potenciais
Como sugestão de melhoria, poderíamos:

- Implementar mensagem informando o motivo de não encontrar quarto disponível
- Opção de informar a quantidade de adultos
- Uma apresentação de todos os preços/tarifas dos quartos e suas diferenças

Entre outras potenciais melhorias do sistema como um todo, como alterar de POST pra GET com Query params, mudança do nome da entidade pra Search ou
da rota pra Browser, entre outros.

## Variáveis de Ambiente
```
PORT=8080
BASE_URL=https://reservations.fasthotel.me/188/214
```

## Dependências
- Express.js: Framework web
- Puppeteer: Web scraping
- Zod: Validação
- Jest: Framework de testes
- Supertest: Testes HTTP