# Componentes UI Padronizados

Este diretório contém componentes de interface padronizados para o projeto ABEC Med.

## Componentes Disponíveis

### Input

Componente de input de texto padronizado com suporte a labels, erros e ícones.

```tsx
import { Input } from '@/components/ui';
import { FaSearch } from 'react-icons/fa';

// Input básico
<Input
  label="Nome"
  placeholder="Digite seu nome"
  required
/>

// Input com erro
<Input
  label="Email"
  type="email"
  error="Email inválido"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input de busca com ícone
<Input
  variant="search"
  placeholder="Buscar..."
  icon={<FaSearch />}
/>
```

### Select

Componente de select padronizado com suporte a opções e validação.

```tsx
import { Select } from '@/components/ui';

// Select com opções inline
<Select label="Tipo" required>
  <option value="admin">Administrador</option>
  <option value="doctor">Médico</option>
  <option value="patient">Paciente</option>
</Select>

// Select com array de opções
<Select
  label="Status"
  options={[
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ]}
  placeholder="Selecione um status"
/>
```

### Textarea

Componente de textarea padronizado.

```tsx
import { Textarea } from "@/components/ui";

<Textarea
  label="Descrição"
  rows={4}
  placeholder="Digite a descrição..."
  helperText="Máximo 500 caracteres"
/>;
```

## Características dos Componentes

- **Estilo Consistente**: Todos seguem o design system do projeto
- **Cores Padronizadas**: Usam a cor primária `#16829E` para focus
- **Texto Cinza Escuro**: Todos os inputs usam `text-gray-900` como padrão
- **Validação Visual**: Suporte a estados de erro com bordas vermelhas
- **Acessibilidade**: Labels associados e indicadores visuais
- **TypeScript**: Tipagem completa com IntelliSense
- **Flexibilidade**: Aceitam todas as props nativas dos elementos HTML

## Importação

```tsx
// Importação individual
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

// Importação em lote
import { Input, Select, Textarea } from "@/components/ui";
```

## Padrões de Cor

- **Texto**: `text-gray-900` (cinza escuro)
- **Bordas**: `border-gray-300` (cinza claro)
- **Focus**: `ring-[#16829E]` e `border-[#16829E]` (cor primária)
- **Erro**: `border-red-500` e `ring-red-500` (vermelho)
- **Labels**: `text-gray-700` (cinza médio)
