# Backend Node.js

### Stack Instalado

- ✅ Express 5.1.0 - Framework web
- ✅ TypeScript 5.9.3 - Tipagem completa
- ✅ CORS 2.8.5 - Requisições cross-origin
- ✅ dotenv 17.2.3 - Variáveis de ambiente
- ✅ tsx 4.20.6 - Execução TypeScript em dev
- ✅ ESLint + Prettier - Qualidade de código

### Estrutura

```
src/
├── index.ts              (Servidor Express com CORS)
├── config.ts             (Variáveis de ambiente)
└── utils/
    └── response.ts       (Padrão HTTP - success/error)

dist/                     (Build compilado - pronto para produção)
tsconfig.json             (Config TypeScript strict)
package.json              (Scripts dev/build/start)
.env.example              (Template de variáveis)
.gitignore
```

### Endpoints Prontos

- `GET /api/health` - Health check
- `GET /api` - Endpoint principal
- `404` - Tratamento de rota não encontrada
- Error handler global

### Padrão de Resposta HTTP

```typescript
{
  "success": true,
  "data": { /* dados */ },
  "timestamp": "2025-10-15T23:45:00.000Z"
}
```

## Como Rodar

**Desenvolvimento (hot-reload com tsx):**

```bash
npm run dev
# Rodando em http://localhost:3000
```

**Produção:**

```bash
npm run build    # Compila para dist/
npm start        # Roda versão compilada
```

**Qualidade de código:**

```bash
npm run lint
npm run format
```

## Status

- TypeScript: ✅ Compilando sem erros
- Servidor: ✅ Rodando em http://localhost:3000
- Health Check: ✅ `/api/health` funcional
- Build: ✅ `npm run build` OK

## 🎯 Filosofia

- Minimalismo - estrutura enxuta
- TypeScript strict - tipagem completa
- Padrão unificado - compatível com React frontend
- Fácil extensão - pronto para crescer
