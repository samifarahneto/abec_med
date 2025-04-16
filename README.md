# ABEC Med - Clínica Médica

Sistema de gestão para clínica médica desenvolvido com Next.js, TypeScript e MongoDB.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React para renderização do lado do servidor
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **MongoDB** - Banco de dados NoSQL
- **NextAuth.js** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── register/
│   │   │   └── route.ts
│   │   ├── setup/
│   │   │   └── route.ts
│   │   ├── test-connection/
│   │   │   └── route.ts
│   │   └── users/
│   │       └── route.ts
│   ├── login/
│   │   └── page.tsx
│   ├── registrar/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Header.tsx
├── lib/
│   └── mongodb.ts
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

### Perfis de Usuário

1. **Administrador (admin)**

   - Dashboard
   - Gerenciamento de usuários
   - Configurações do sistema

2. **Médico (doctor)**

   - Consultas
   - Pacientes
   - Agenda

3. **Acolhimento (reception)**

   - Agendamentos
   - Pacientes
   - Relatórios

4. **Paciente (patient)**
   - Minhas consultas
   - Meus exames
   - Meu perfil

### Rotas de API

- **POST /api/register** - Registro de novos usuários
- **POST /api/setup** - Criação do usuário administrador inicial
- **GET /api/test-connection** - Teste de conexão com MongoDB
- **GET/POST /api/auth/[...nextauth]** - Autenticação via NextAuth.js

## 🛠️ Configuração do Ambiente

1. **Variáveis de Ambiente**

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   NEXTAUTH_SECRET=sua_chave_secreta_aqui
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Instalação de Dependências**

   ```bash
   npm install
   ```

3. **Execução do Projeto**
   ```bash
   npm run dev
   ```

## 📱 Responsividade

O projeto segue uma abordagem mobile-first, com breakpoints definidos para diferentes tamanhos de tela:

- Layout adaptativo para mobile, tablet e desktop
- Menu hamburguer para dispositivos móveis
- Design responsivo em todos os componentes

## ⚙️ Configurações Especiais

### Tailwind CSS

- Configuração personalizada em `tailwind.config.js`
- Plugins para forms e typography
- Cores e breakpoints customizados

### Next.js

- App Router
- Server Components
- API Routes
- Middleware para proteção de rotas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Próximos Passos

- [x] Configuração inicial do projeto
- [x] Sistema de autenticação
- [x] Header responsivo com diferentes perfis
- [ ] Dashboard para cada perfil
- [ ] CRUD de pacientes
- [ ] Sistema de agendamento
- [ ] Gestão de consultas
- [ ] Relatórios e estatísticas
- [ ] Sistema de notificações
- [ ] Integração com prontuário eletrônico

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
