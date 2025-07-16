# Endpoints da API para Estados e Cidades

## Endpoint de Estados
- **URL**: `GET /state`
- **Parâmetros**: Nenhum
- **Descrição**: Retorna todos os estados disponíveis
- **Resposta**: Array de objetos com estrutura:
  ```json
  {
    "id": number,
    "name": string,
    "uf": string
  }
  ```

## Endpoint de Cidades
- **URL**: `GET /city/search`
- **Parâmetros**: 
  - `stateId` (required, string/query): ID do estado para filtrar as cidades
- **Descrição**: Busca cidades por ID do estado
- **Exemplo de uso**: `https://abecmed-api.22aczq.easypanel.host/city/search?stateId=26`

## Implementação Necessária

1. **Para Estados**:
   - Buscar todos os estados na API quando o usuário digitar 3+ caracteres
   - Filtrar localmente os resultados baseado no texto digitado
   - Permitir busca por nome ou UF

2. **Para Cidades**:
   - Só habilitar após seleção de um estado
   - Buscar cidades da API usando o ID do estado selecionado
   - Implementar busca com debounce quando usuário digitar 3+ caracteres

3. **Fluxo**:
   - Usuário digita estado → busca na API → filtra resultados
   - Usuário seleciona estado → habilita campo cidade
   - Usuário digita cidade → busca cidades do estado selecionado na API

