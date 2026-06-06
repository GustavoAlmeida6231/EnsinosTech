# Skill: Backend Analisador 🚀

Esta skill mapeia os requisitos do backend para o projeto **EnsinosTech** baseado no frontend atual (telas de Cadastro, Login, Dashboard e Configurações). O banco de dados definido é **PostgreSQL** utilizando **Prisma** e o backend será em **Node.js (Next.js Server Actions)**.

---

## 🗄️ 1. Modelo de Dados (Prisma Schema)

Atualmente, o arquivo `prisma/schema.prisma` está básico e sem a URL de conexão do PostgreSQL. Abaixo está a especificação completa do schema que atende a todos os estados dinâmicos vistos no frontend.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Usuário & Perfil
model Usuario {
  id           String          @id @default(uuid())
  nome         String
  email        String          @unique
  senha        String
  empresa      String?         // Nome do seu negócio (aba de Configurações)
  papel        String          @default("Empreendedor") // Administrador / Empreendedor
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  
  // Relacionamentos
  inscricoes   Inscricao[]
  concluidas   AulaConcluida[]

  @@map("usuarios")
}

// 2. Catálogo de Trilhas (Cursos)
model Curso {
  id          String      @id @default(uuid())
  categoria   String      // ex: "Formalização", "Marketing", "Segurança"
  titulo      String
  descricao   String      @db.Text
  icone       String      // Emoji representativo (ex: "📋", "📣", "🛡️")
  createdAt   DateTime    @default(now())
  
  // Relacionamentos
  aulas       Aula[]
  inscricoes  Inscricao[]

  @@map("cursos")
}

// 3. Aulas de cada Curso
model Aula {
  id          String          @id @default(uuid())
  titulo      String
  duracao     String          // ex: "15 min"
  cursoId     String
  curso       Curso           @relation(fields: [cursoId], references: [id], onDelete: Cascade)
  
  // Relacionamentos
  concluidas  AulaConcluida[]

  @@map("aulas")
}

// 4. Tabela Pivot: Inscrição em Trilhas
model Inscricao {
  id          String   @id @default(uuid())
  usuarioId   String
  cursoId     String
  createdAt   DateTime @default(now())

  usuario     Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  curso       Curso    @relation(fields: [cursoId], references: [id], onDelete: Cascade)

  @@unique([usuarioId, cursoId]) // Evita dupla inscrição
  @@map("inscricoes")
}

// 5. Tabela Pivot: Aulas Concluídas
model AulaConcluida {
  id          String   @id @default(uuid())
  usuarioId   String
  aulaId      String
  createdAt   DateTime @default(now())

  usuario     Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  aula        Aula     @relation(fields: [aulaId], references: [id], onDelete: Cascade)

  @@unique([usuarioId, aulaId]) // Evita dupla marcação de conclusão
  @@map("aulas_concluidas")
}
```

---

## 🛠️ 2. Ações de Backend a Implementar (Server Actions)

Seguindo a estrutura de Server Actions já existente em `action/auth.ts`, precisamos estender o backend com as seguintes ações agrupadas:

### 🔑 A. Autenticação e Perfil (`action/auth.ts`)

| Ação | Descrição | Integração com Frontend |
| :--- | :--- | :--- |
| **`criarConta`** | Criptografa a senha com `bcryptjs`, verifica se o e-mail já existe e persiste no BD. | Utilizada no formulário de `app/cadastro/page.tsx`. |
| **`login`** | Compara a senha digitada com a criptografada e inicia a sessão (via JWT ou Cookie seguro). | Utilizada no formulário de `app/login/page.tsx`. |
| **`obterPerfil`** | Retorna o perfil do usuário logado (nome, e-mail, empresa, papel) a partir do ID da sessão. | Utilizada para hidratar o estado `perfil` no `app/dashboard/page.tsx`. |
| **`atualizarPerfil`** | Permite alterar nome, e-mail e empresa. | Executada no botão "Salvar Modificações" na aba de Configurações. |

### 📚 B. Gerenciamento de Cursos e Progresso (`action/cursos.ts` - *A criar*)

| Ação | Descrição | Integração com Frontend |
| :--- | :--- | :--- |
| **`listarCursos`** | Carrega todas as trilhas disponíveis com suas respectivas aulas do banco PostgreSQL. | Alimenta a lista `listaCursos` no `app/dashboard/page.tsx`. |
| **`inscreverCurso`** | Cria um registro em `Inscricao` vinculando o usuário atual à trilha selecionada. | Disparado pelo botão "Inscrever-se na Trilha". |
| **`desinscreverCurso`** | Remove o registro correspondente da tabela `Inscricao`. | Disparado pelo botão "Cancelar Inscrição neste Curso". |
| **`alternarAulaConcluida`** | Adiciona ou remove o registro na tabela `AulaConcluida` para rastrear o avanço do aluno. | Disparado pelo botão "Marcar como Feita" / "Finalizada" na listagem de aulas. |

---

## 📈 3. Oportunidades de Melhoria Identificadas no Frontend

Para conectar perfeitamente com o backend proposto, algumas pequenas alterações no frontend atual serão recomendadas:
1. **Redirecionamento Pós-Cadastro:** A action `criarConta` hoje retorna apenas um objeto de sucesso. O frontend precisa receber isso e redirecionar para a página `/login`.
2. **Autenticação no Login:** A página `/login` atualmente possui um `<Link href="/dashboard">` estático em vez de submeter os dados para um formulário ou action. É necessário alterar para usar Server Action com controle de sessão.
3. **Persistência de Estado:** Substituir os hooks `useState` locais do dashboard por consultas assíncronas (`useEffect` ou Server Components de Next.js) que consomem os Server Actions acima.

---

## 🚀 Próximos Passos Recomendados

1. **Configurar variáveis de ambiente:** Criar o arquivo `.env` com a conexão do banco PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/ensino_tech?schema=public"
   ```
2. **Aplicar Migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Instanciar o Prisma Client:** Criar o arquivo `lib/prisma.ts` para evitar conexões duplicadas em desenvolvimento:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
   
   export const prisma = globalForPrisma.prisma || new PrismaClient()
   
   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
   ```
