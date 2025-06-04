# 🌐 Autenticação API Externa - AbecMed

## 📋 Visão Geral

O sistema ABEC Med agora usa **EXCLUSIVAMENTE** a API externa do AbecMed para autenticação:

- ✅ **Autenticação única via API AbecMed**
- ✅ **Sessão JWT com cookies seguros**
- ✅ **Redirecionamento automático por role**
- ❌ **Sem sistema local** - Removido completamente

## ⚙️ Configuração

### Variável de Ambiente OBRIGATÓRIA

Adicione no seu arquivo `.env.local`:

```env
BASE_URL=https://abecmed-api-hrgcn.ondigitalocean.app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

**⚠️ IMPORTANTE:** Sem `BASE_URL` configurada, o sistema não funcionará.

## 🔄 Fluxo de Autenticação

### Login Direto na API Externa

**Endpoint:** `${BASE_URL}/api/auth/login`
**Método:** POST
**Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta Esperada:**

```json
{
  "data": {
    "data": {
      "access_token": "eyJhbGciOi...",
      "user": {
        "id": 3,
        "email": "admin@system.com",
        "role": "ADMIN"
      }
    },
    "message": "Success",
    "statusCode": 200
  }
}
```

### Mapeamento de Roles

| API Externa | Sistema Local | Redirecionamento            |
| ----------- | ------------- | --------------------------- |
| `ADMIN`     | `admin`       | `/admin/dashboard`          |
| `DOCTOR`    | `medico`      | `/medic`                    |
| `MEDICO`    | `medico`      | `/medic`                    |
| `RECEPTION` | `reception`   | `/acolhimento/agendamentos` |
| `PATIENT`   | `paciente`    | `/paciente/dashboard`       |
| `PACIENTE`  | `paciente`    | `/paciente/dashboard`       |

## 🚨 Tratamento de Erros

### Mensagens Específicas por Status HTTP

- **401**: "Email ou senha incorretos"
- **403**: "Acesso negado. Verifique suas permissões."
- **404**: "Serviço de autenticação não encontrado"
- **500**: "Erro interno do servidor. Tente novamente em alguns minutos."
- **503**: "Serviço temporariamente indisponível. Tente novamente."

### Se API Externa Não Estiver Configurada

Se `BASE_URL` não estiver configurada, o sistema retornará:

```
"Configuração da API externa não encontrada. Contate o administrador."
```

## 🔐 Sessão JWT

### Dados Armazenados na Sessão

```typescript
{
  id: string,
  email: string,
  name: string,
  role: string,
  accessToken: string // Token da API externa
}
```

### Configurações de Cookie

- **HttpOnly**: Sim (segurança contra XSS)
- **SameSite**: lax (proteção CSRF)
- **Secure**: Apenas em produção (HTTPS)
- **Duração**: 30 dias com renovação a cada 24h

## 🧪 Como Testar

### 1. Verificar Configuração

Acesse: `http://localhost:3000/api/test-env`

**Esperado:**

```json
{
  "BASE_URL": "https://abecmed-api-hrgcn.ondigitalocean.app",
  "NEXTAUTH_URL": "http://localhost:3000",
  "NEXTAUTH_SECRET": "Configurada"
}
```

### 2. Testar Login

1. Acesse: `http://localhost:3000/login`
2. Use credenciais válidas da API AbecMed
3. Verifique logs no console (F12):

```
🔍 [API Externa] Iniciando autenticação...
🔍 [API Externa] BASE_URL: https://abecmed-api-hrgcn.ondigitalocean.app
🌐 [API Externa] Endpoint: https://abecmed-api-hrgcn.ondigitalocean.app/api/auth/login
📡 [API Externa] Status da resposta: 200
✅ [API Externa] Resposta recebida: {...}
🎯 [API Externa] Usuário autenticado com sucesso: {...}
```

## 📊 Logs de Debug

Em desenvolvimento, você verá logs detalhados:

### ✅ Login Bem-sucedido

```
=== AUTENTICAÇÃO ABEC MED API ===
Email: usuario@exemplo.com
🚀 Autenticando via API externa...
🔍 [API Externa] Iniciando autenticação...
📡 [API Externa] Status da resposta: 200
🎯 [API Externa] Usuário autenticado com sucesso
✅ Login bem-sucedido para: usuario@exemplo.com
```

### ❌ Login com Erro

```
=== AUTENTICAÇÃO ABEC MED API ===
📡 [API Externa] Status da resposta: 401
📝 [API Externa] Detalhes do erro: {...}
💥 [API Externa] Erro: Email ou senha incorretos
```

## 🚀 Vantagens da Nova Implementação

1. **Simplicidade**: Apenas uma fonte de autenticação
2. **Consistência**: Sempre usa dados atuais da API
3. **Segurança**: Token original da API preservado
4. **Performance**: Menos código, execução mais rápida
5. **Manutenção**: Menos pontos de falha

## ⚠️ Considerações Importantes

- **API Externa Obrigatória**: Sistema não funciona sem ela
- **Conectividade**: Usuário precisa de conexão com a API
- **Credenciais**: Apenas usuários válidos na API AbecMed podem acessar
- **Fallback**: Não há sistema de backup - apenas API externa

## 🔧 Troubleshooting

### "Configuração da API externa não encontrada"

**Causa**: BASE_URL não configurada
**Solução**: Verificar arquivo `.env.local`

### "Email ou senha incorretos"

**Causa**: Credenciais inválidas na API
**Solução**: Verificar credenciais no sistema AbecMed

### "Erro de conectividade"

**Causa**: API externa inacessível
**Solução**: Verificar conexão de rede e status da API

---

**Status:** ✅ Sistema simplificado usando APENAS API externa
