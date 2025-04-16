# ABEC Med - Clínica Médica

Este é um projeto desenvolvido com [Next.js](https://nextjs.org) e [Tailwind CSS](https://tailwindcss.com), criado para a clínica médica ABEC Med.

## 🚀 Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org) - Framework React para produção
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitário
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript tipado
- [React](https://react.dev) - Biblioteca JavaScript para interfaces
- [MongoDB](https://www.mongodb.com) - Banco de dados NoSQL
- [NextAuth.js](https://next-auth.js.org) - Autenticação para Next.js
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Criptografia de senhas

## 📋 Estrutura do Projeto

```
abec_med/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout principal da aplicação
│   │   ├── page.tsx          # Página inicial
│   │   ├── login/            # Página de login
│   │   ├── globals.css       # Estilos globais
│   │   ├── api/              # Rotas da API
│   │   │   ├── auth/         # Rotas de autenticação
│   │   │   ├── setup/        # Configuração inicial
│   │   │   └── users/        # Gerenciamento de usuários
│   │   └── (rotas futuras)   # Outras páginas do site
│   ├── components/
│   │   ├── Header.tsx        # Componente de cabeçalho responsivo
│   │   ├── auth/             # Componentes de autenticação
│   │   └── layouts/          # Layouts específicos por perfil
│   ├── lib/
│   │   ├── mongodb.ts        # Conexão com MongoDB
│   │   └── auth.ts           # Configuração de autenticação
│   ├── models/
│   │   └── User.ts           # Modelo de usuário
│   ├── providers/
│   │   └── AuthProvider.tsx  # Provedor de autenticação
│   └── types/
│       └── next-auth.d.ts    # Tipos para NextAuth
├── public/                    # Arquivos estáticos
├── tailwind.config.js         # Configuração do Tailwind CSS
└── package.json               # Dependências do projeto
```

## 🔐 Autenticação e Autorização

### Endpoints da API

1. **Configuração Inicial**

   ```
   POST /api/setup
   ```

   Cria o primeiro usuário administrador do sistema.

   Corpo da requisição:

   ```json
   {
     "name": "Administrador",
     "email": "admin@abecmed.com",
     "password": "admin123"
   }
   ```

2. **Gerenciamento de Usuários**

   ```
   POST /api/users
   ```

   Cria um novo usuário.

   ```
   GET /api/users
   ```

   Lista todos os usuários.

3. **Autenticação**

   ```
   POST /api/auth/signin
   ```

   Realiza o login do usuário.

   ```
   POST /api/auth/signout
   ```

   Realiza o logout do usuário.

### Estrutura de Autenticação

- Login com email/senha
- Senhas criptografadas com bcryptjs
- Sessões JWT
- Proteção de rotas por perfil
- Middleware de autorização

### Perfis de Usuário

1. **Administrador**

   - Acesso total ao sistema
   - Gerenciamento de usuários
   - Relatórios administrativos

2. **Médico**

   - Visualização de seus pacientes
   - Agendamento de consultas
   - Prontuários médicos
   - Prescrições

3. **Secretária**
   - Agendamento de consultas
   - Cadastro de pacientes
   - Gerenciamento de horários
   - Controle de pagamentos

## 🎨 Design System

### Cores

- Azul Principal: `#16829E`
- Branco: `#FFFFFF`
- Indigo (Botões): `#4F46E5`

### Breakpoints

- Mobile: `640px`
- Tablet: `768px`
- Desktop Pequeno: `1024px`
- Desktop Médio: `1280px`
- Desktop Grande: `1536px`

## 🛠️ Funcionalidades Implementadas

### Autenticação

- Login com email/senha
- Proteção de rotas
- Diferentes níveis de acesso
- Sessões seguras

### Header Responsivo

- Menu adaptativo para mobile e desktop
- Navegação com transições suaves
- Logo da clínica
- Menu hamburguer para dispositivos móveis
- Diferentes menus por perfil de usuário

### Layout Responsivo

- Design mobile-first
- Grid adaptativo para diferentes tamanhos de tela
- Cards de serviços responsivos
- Footer com informações de contato

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
# Edite o .env.local com suas configurações
```

4. Crie o usuário administrador inicial:

```bash
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Administrador","email":"admin@abecmed.com","password":"admin123"}'
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

6. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## 📱 Responsividade

O projeto foi desenvolvido seguindo a abordagem mobile-first, garantindo uma experiência otimizada em:

- Smartphones
- Tablets
- Desktops
- Telas grandes

## 🔧 Configurações Especiais

### NextAuth.js

- Autenticação por credenciais
- Sessões JWT
- Callbacks personalizados
- Páginas de login personalizadas

### MongoDB

- Conexão otimizada
- Cache de conexão
- Schemas tipados
- Índices otimizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Próximos Passos

- [x] Implementar sistema de autenticação
- [ ] Implementar página de serviços
- [ ] Implementar página de contato
- [ ] Adicionar formulário de agendamento
- [ ] Adicionar área do paciente
- [ ] Implementar dashboard para médicos
- [ ] Criar sistema de prontuários
- [ ] Desenvolver módulo de agendamento
- [ ] Implementar chat entre médico e paciente
