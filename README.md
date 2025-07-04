# ABEC Med - Clínica Médica

Sistema de gestão para clínica médica desenvolvido com Next.js, TypeScript e **API Externa ABEC Med**.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React para renderização do lado do servidor
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **NextAuth.js v5** - Autenticação e autorização
- **API Externa ABEC Med** - Sistema de autenticação e dados

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── admin/
│   ├── medic/
│   ├── paciente/
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   └── ui/
├── config/
│   └── api.ts
├── providers/
│   └── AuthProvider.tsx
└── types/
    └── next-auth.d.ts
```

## 🎨 Sistema de Design

### Cores

- **Primária**: `#16829E` (Azul principal)
- **Secundária**: `#1E3A8A` (Azul escuro)
- **Acentuação**: `#10B981` (Verde)
- **Neutras**:
  - Branco: `#FFFFFF`
  - Cinza claro: `#F3F4F6`
  - Cinza médio: `#9CA3AF`
  - Cinza escuro: `#4B5563`

### Breakpoints

- Mobile: `640px`
- Tablet: `768px`
- Desktop: `1024px`
- Large: `1280px`

## 🔐 Autenticação e Perfis

### Integração com API Externa

O sistema usa **exclusivamente** a API externa ABEC Med:

- **Endpoint**: `https://abecmed-api.22aczq.easypanel.host/auth/login`
- **Autenticação JWT** via NextAuth.js v5
- **Sem banco de dados local** - Todos os dados vêm da API

### Perfis de Usuário

1. **Administrador (admin)**

   - Dashboard administrativo
   - Gerenciamento de usuários
   - Configurações do sistema

2. **Médico (doctor)**

   - Consultas e pacientes
   - Agenda médica

3. **Acolhimento (reception)**

   - Agendamentos
   - Atendimento ao paciente

4. **Paciente (patient)**
   - Dashboard pessoal
   - Consultas e exames

## 🛠️ Configuração do Ambiente

### 1. Variáveis de Ambiente **OBRIGATÓRIAS**

Crie o arquivo `.env.local` na raiz do projeto:

```env
# API Externa ABEC Med
NEXT_PUBLIC_API_BASE_URL=https://abecmed-api.22aczq.easypanel.host

# NextAuth.js v5
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-super-forte-aqui
```

### 2. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🌐 API Externa

### Configuração

A API está configurada em `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://abecmed-api.22aczq.easypanel.host",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/me",
    // ... outros endpoints
  },
};
```

### Autenticação

```typescript
// Login via API externa
POST https://abecmed-api.22aczq.easypanel.host/auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## 📱 Responsividade

O projeto segue uma abordagem mobile-first:

- Layout adaptativo para todos os dispositivos
- Menu responsivo com drawer mobile
- Design moderno e acessível

## ⚙️ Funcionalidades

### ✅ Implementado

- [x] Autenticação via API externa
- [x] Sistema de rotas protegidas
- [x] Header responsivo com perfis
- [x] Middleware de autenticação
- [x] Redirecionamento por role
- [x] Configuração de variáveis de ambiente

### 🚧 Em Desenvolvimento

- [ ] Dashboard para cada perfil
- [ ] CRUD de pacientes via API
- [ ] Sistema de agendamento
- [ ] Gestão de consultas
- [ ] Relatórios e estatísticas

## 🔧 Configurações Especiais

### NextAuth.js v5

- **Estratégia**: JWT com cookies seguros
- **Providers**: Credentials (API externa)
- **Callbacks** personalizados para roles
- **Páginas** customizadas de login

### Middleware

Proteção automática de rotas baseada em roles:

```typescript
// middleware.ts
export const config = {
  matcher: ["/admin/:path*", "/medic/:path*", "/paciente/:path*"],
};
```

## 🚀 Deploy

### Variáveis de Produção

```env
NEXT_PUBLIC_API_BASE_URL=https://abecmed-api.22aczq.easypanel.host
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=chave-super-segura-para-producao
```

### Vercel / Netlify

1. Configure as variáveis de ambiente
2. Conecte o repositório
3. Deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📋 Próximos Passos

- [ ] Implementar dashboards específicos por role
- [ ] Integração completa com todos os endpoints da API
- [ ] Sistema de notificações em tempo real
- [ ] Módulo de telemedicina
- [ ] App mobile React Native

## 🆘 Suporte

Para problemas relacionados à:

- **API Externa**: Contate a equipe ABEC Med
- **Frontend**: Abra uma issue neste repositório
- **Configuração**: Verifique a documentação em `/docs`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🔗 API Externa:** `https://abecmed-api.22aczq.easypanel.host`
**📚 Documentação:** `/docs/API_EXTERNA_INTEGRATION.md`
