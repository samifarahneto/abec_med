# ABEC Med - Clínica Médica

Este é um projeto desenvolvido com [Next.js](https://nextjs.org) e [Tailwind CSS](https://tailwindcss.com), criado para a clínica médica ABEC Med.

## 🚀 Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org) - Framework React para produção
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitário
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript tipado
- [React](https://react.dev) - Biblioteca JavaScript para interfaces
- [MongoDB](https://www.mongodb.com) - Banco de dados NoSQL
- [NextAuth.js](https://next-auth.js.org) - Autenticação para Next.js

## 📋 Estrutura do Projeto

```
abec_med/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout principal da aplicação
│   │   ├── page.tsx          # Página inicial
│   │   ├── globals.css       # Estilos globais
│   │   ├── api/              # Rotas da API
│   │   │   └── auth/         # Rotas de autenticação
│   │   └── (rotas futuras)   # Outras páginas do site
│   ├── components/
│   │   ├── Header.tsx        # Componente de cabeçalho responsivo
│   │   ├── auth/             # Componentes de autenticação
│   │   └── layouts/          # Layouts específicos por perfil
│   ├── lib/
│   │   ├── mongodb.ts        # Conexão com MongoDB
│   │   └── auth.ts           # Configuração de autenticação
│   └── types/
│       └── user.ts           # Tipos para usuários e perfis
├── public/                    # Arquivos estáticos
├── tailwind.config.js         # Configuração do Tailwind CSS
└── package.json               # Dependências do projeto
```

## 👥 Perfis de Usuário

### Estrutura de Dados no MongoDB

```typescript
interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "medico" | "paciente" | "secretaria";
  profile: {
    crm?: string; // Apenas para médicos
    especialidade?: string; // Apenas para médicos
    dataNascimento?: Date; // Para pacientes
    telefone?: string;
    endereco?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Permissões e Acessos

1. **Administrador**

   - Acesso total ao sistema
   - Gerenciamento de usuários
   - Relatórios administrativos

2. **Médico**

   - Visualização de seus pacientes
   - Agendamento de consultas
   - Prontuários médicos
   - Prescrições

3. **Paciente**

   - Agendamento de consultas
   - Visualização de histórico
   - Acesso a exames
   - Comunicação com médicos

4. **Secretária**
   - Agendamento de consultas
   - Cadastro de pacientes
   - Gerenciamento de horários
   - Controle de pagamentos

## 🔐 Autenticação e Autorização

### Estrutura de Autenticação

- Login com email/senha
- Recuperação de senha
- Sessões seguras
- Proteção de rotas por perfil

### Middleware de Autorização

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Verifica se o usuário tem acesso à rota baseado no seu perfil
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/acesso-negado", req.url));
    }
    if (pathname.startsWith("/medico") && token?.role !== "medico") {
      return NextResponse.redirect(new URL("/acesso-negado", req.url));
    }
    // ... outras verificações

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/medico/:path*",
    "/paciente/:path*",
    "/secretaria/:path*",
  ],
};
```

## 🎨 Design System

### Cores

- Azul Principal: `#16829E`
- Branco: `#FFFFFF`

### Breakpoints

- Mobile: `640px`
- Tablet: `768px`
- Desktop Pequeno: `1024px`
- Desktop Médio: `1280px`
- Desktop Grande: `1536px`

## 🛠️ Funcionalidades Implementadas

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

### Componentes

- Header compartilhado entre todas as páginas
- Cards de serviços com hover effects
- Seção de contato responsiva
- Links para redes sociais
- Componentes específicos por perfil

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:

```bash
npm install mongodb mongoose next-auth
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
# Edite o .env.local com suas configurações
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## 📱 Responsividade

O projeto foi desenvolvido seguindo a abordagem mobile-first, garantindo uma experiência otimizada em:

- Smartphones
- Tablets
- Desktops
- Telas grandes

## 🔧 Configurações Especiais

### Tailwind CSS

- Configuração personalizada de breakpoints
- Cores personalizadas
- Utilitários para responsividade

### Next.js

- Otimização de imagens
- Roteamento dinâmico
- Renderização híbrida (SSR/CSR)

### MongoDB

- Schemas para diferentes perfis
- Índices otimizados
- Queries eficientes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Próximos Passos

- [ ] Implementar página de serviços
- [ ] Implementar página de contato
- [ ] Adicionar formulário de agendamento
- [ ] Implementar sistema de autenticação
- [ ] Adicionar área do paciente
- [ ] Implementar dashboard para médicos
- [ ] Criar sistema de prontuários
- [ ] Desenvolver módulo de agendamento
- [ ] Implementar chat entre médico e paciente
