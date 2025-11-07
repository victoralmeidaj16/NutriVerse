# Scripts de Geração de Receitas Base

Este diretório contém scripts para gerar receitas base para o NutriVerse.

## Geração de Receitas Base

O script `generateBaseRecipes.js` gera 5 receitas para cada objetivo (perder peso, ganhar massa, saúde geral) e salva no Firebase.

### Pré-requisitos

1. Node.js 18+ (com suporte a fetch nativo) ou instalar `node-fetch`
2. Firebase configurado no projeto
3. Backend rodando (ou usar a URL do Render)

### Como executar

#### Opção 1: Via Node.js (se tiver fetch nativo)

```bash
cd /Users/victoralmeidaj16/Downloads/Food-App
node scripts/generateBaseRecipes.js
```

#### Opção 2: Via curl (gerar uma receita por vez)

```bash
# Gerar receita para perder peso
curl -X POST https://nutriversee.onrender.com/api/generate-base-recipe \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "lose_weight",
    "recipeTitle": "Salada de quinoa com frango grelhado e vegetais"
  }'
```

#### Opção 3: Criar um endpoint admin no backend

Você pode criar um endpoint `/api/admin/generate-all-recipes` que executa o script internamente.

### Estrutura das Receitas

As receitas são salvas no Firebase em:
```
/recipes/{goal}/{recipeId}
```

Onde `goal` pode ser:
- `lose_weight` - Perder peso
- `gain_mass` - Ganhar massa  
- `general_health` - Saúde geral

### Receitas por Objetivo

#### Perder Peso (lose_weight)
1. Salada de quinoa com frango grelhado e vegetais
2. Sopa de legumes com proteína magra
3. Bowl de salmão com abacate e vegetais
4. Omelete de claras com espinafre e cogumelos
5. Frango grelhado com batata doce e brócolis

#### Ganhar Massa (gain_mass)
1. Frango com arroz integral e feijão
2. Macarrão integral com carne moída e molho
3. Bowl de frango, batata doce e quinoa
4. Peito de peru com batata e vegetais
5. Salmão com arroz e legumes

#### Saúde Geral (general_health)
1. Salmão grelhado com quinoa e vegetais
2. Frango ao curry com arroz integral
3. Bowl mediterrâneo com grão-de-bico
4. Peixe assado com batata doce e salada
5. Risotto de cogumelos com proteína

### Notas

- O script faz uma pausa de 2 segundos entre cada receita para evitar rate limiting
- Em caso de erro, o script continua com a próxima receita
- As receitas são geradas usando OpenAI GPT-4
- Certifique-se de que a API key do OpenAI está configurada no backend

