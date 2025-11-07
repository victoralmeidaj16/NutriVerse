# 🔧 Correção do Erro no Render

## Problema

O Render está procurando o diretório errado:
```
Service Root Directory "/opt/render/project/src/beckend" is missing.
```

## ✅ Solução Imediata

### Passo a passo:

1. **Acesse o Dashboard do Render**
   - Vá para https://dashboard.render.com
   - Clique no seu serviço "NutriVerse"

2. **Vá para Settings**
   - No menu lateral, clique em **Settings**
   - Ou clique no botão **Settings** no topo

3. **Corrija o Root Directory**
   - Role até a seção **Root Directory**
   - **Apague tudo** que estiver lá (provavelmente `src/beckend` ou similar)
   - Digite apenas: `backend` (sem espaços, sem barras, sem `src/`)
   - ✅ Deve ficar assim: `backend`

4. **Salve as alterações**
   - Clique em **Save Changes** no final da página

5. **Faça um novo deploy**
   - Clique em **Manual Deploy** → **Deploy latest commit**
   - Ou faça um pequeno commit e push para trigger automático

## ⚠️ Valores CORRETOS no Render

| Campo | Valor Correto |
|-------|---------------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Branch** | `main` |

## 📝 Checklist

- [ ] Root Directory = `backend` (sem `src/`, sem `/`, sem erros de digitação)
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] Environment Variable `OPENAI_API_KEY` está configurada
- [ ] Branch = `main`

## 🔍 Verificação

Após o deploy, você deve ver nos logs:
```
🚀 NutriVerse API server running on port 3000
📝 Health check: http://localhost:3000/health
```

E NÃO deve aparecer mais o erro:
```
❌ Service Root Directory "/opt/render/project/src/beckend" is missing.
```

