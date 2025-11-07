# Deploy do Backend no Render

## Configuração no Render Dashboard

### 1. Informações Básicas

- **Branch**: `main`
- **Region**: `Oregon (US West)` (ou sua região preferida)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. Environment Variables

Adicione a seguinte variável de ambiente:

- **Key**: `OPENAI_API_KEY`
- **Value**: `your_openai_api_key_here` (adicione sua chave real no dashboard do Render)

**Nota**: O Render define automaticamente a variável `PORT`, não é necessário configurá-la.

### 3. Após o Deploy

1. Aguarde o deploy completar (pode levar alguns minutos na primeira vez)
2. Copie a URL do serviço (exemplo: `https://nutriverse.onrender.com`)
3. Adicione a URL ao arquivo `.env` do app móvel:

```bash
EXPO_PUBLIC_API_URL=https://nutriverse.onrender.com
```

Ou configure diretamente no código, editando:
- `src/services/openai/imageGeneration.ts`
- `src/services/openai/openaiService.ts`

Substitua `http://localhost:3000` pela URL do Render.

### 4. Testando o Backend

Após o deploy, teste o endpoint de health check:

```
GET https://seu-app.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "NutriVerse API is running"
}
```

### 5. Monitoramento

- Verifique os logs no dashboard do Render para debug
- O backend entra em "sleep" após 15 minutos de inatividade (no plano gratuito)
- A primeira requisição após o sleep pode levar alguns segundos

## Troubleshooting

### ❌ Erro: "Service Root Directory is missing" ou "No such file or directory"

**Sintoma:**
```
Service Root Directory "/opt/render/project/src/beckend" is missing.
builder.sh: line 51: cd: /opt/render/project/src/beckend: No such file or directory
```

**Solução:**
1. Vá no dashboard do Render
2. Clique no seu serviço
3. Vá em **Settings**
4. Role até **Root Directory**
5. **Deixe vazio** ou configure exatamente: `backend` (sem `src/`, sem `/`, sem erros de digitação)
6. Clique em **Save Changes**
7. Faça um novo deploy

**⚠️ IMPORTANTE:**
- ✅ Correto: `backend`
- ❌ Errado: `src/backend`
- ❌ Errado: `src/beckend` (erro de digitação)
- ❌ Errado: `/backend`
- ❌ Errado: `backend/`

### Backend não inicia

- Verifique se `OPENAI_API_KEY` está configurada
- Verifique os logs no Render para erros
- Confirme que o Root Directory está correto (`backend`)

### Erro 404

- Confirme que a URL está correta
- Verifique se o serviço está "Live" no dashboard

### Timeout

- No plano gratuito, o primeiro request após sleep pode demorar
- Considere usar um serviço de "ping" para manter o serviço ativo

