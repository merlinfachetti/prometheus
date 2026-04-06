# Prometheus

Plataforma desktop de aprendizado de Física para autodidatas. Offline-first, progressiva, sem dependência de internet.

## Visão Geral

Prometheus é uma aplicação desktop construída com Tauri v2 que guia o usuário através de módulos de Física com lições progressivas, exercícios interativos e acompanhamento de progresso local. O público-alvo são adultos não-técnicos (50+) que querem aprender Física no próprio ritmo.

## Stack

- **Frontend:** React 19, TypeScript 6, Tailwind CSS v4, Vite 8
- **Backend:** Rust (Tauri v2)
- **Persistência:** SQLite via `tauri-plugin-sql`
- **Conteúdo:** JSON estático bundled em build time (`import.meta.glob`)

## Arquitetura

```
prometheus/
├── content/
│   └── locales/
│       ├── pt-BR/          # Conteúdo em português
│       │   ├── ui.json     # Strings da interface
│       │   └── modules/
│       │       └── kinematics/
│       │           ├── module.json
│       │           └── kinematics-*.json  # 8 lições
│       └── en/             # Conteúdo em inglês
│           └── ui.json
├── src/
│   ├── components/         # UI components (Layout, ExerciseCard, LessonBlock, etc.)
│   ├── pages/              # Welcome, ModuleOverview, Lesson, ModuleComplete, Settings
│   ├── services/           # contentLoader, progress (SQLite), i18n
│   ├── hooks/              # useI18n
│   ├── types/              # content.ts, i18n.ts
│   └── styles/             # index.css (design tokens + animations)
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs          # Tauri builder, SQL plugin, migrations
│   │   └── commands.rs     # Rust commands
│   └── tauri.conf.json
└── package.json
```

### Decisões de design

- **Código em inglês, conteúdo em PT-BR.** O i18n é separado do código — strings de UI vivem em `content/locales/{lang}/ui.json`, conteúdo pedagógico em JSONs por módulo.
- **Offline-first.** Todo conteúdo é importado via `import.meta.glob` com eager loading. Nenhuma requisição de rede em runtime.
- **Progressão bloqueada.** Aulas são desbloqueadas sequencialmente — o usuário só avança após completar a anterior.
- **SQLite local.** Progresso salvo com upsert que preserva a melhor nota. Reset disponível via Settings.

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 22
- [Rust](https://rustup.rs/) (stable)
- Tauri v2 system dependencies ([docs](https://v2.tauri.app/start/prerequisites/))

## Setup

```bash
# Instalar dependências
npm install

# Rodar em modo dev (abre a janela Tauri)
npm run tauri dev

# Build para produção
npm run tauri build
```

## Módulo atual: Cinemática

8 lições cobrindo o conteúdo fundamental:

1. O que é Movimento
2. Posição e Referencial
3. Velocidade
4. Velocidade Média
5. Movimento Retilíneo Uniforme (MRU)
6. Aceleração
7. Movimento Retilíneo Uniformemente Variado (MRUV)
8. Queda Livre

Total: 30 exercícios com feedback imediato, dicas e explicações.

## Roadmap

- **Fase 1 (atual):** Core system — app setup, renderização de lições, progresso
- **Fase 2:** Motor de aprendizado — exercícios avançados, sistema de feedback
- **Fase 3:** Tutor — sistema de ajuda contextual expandido
- **Fase 4:** Expansão — mais módulos e conteúdo

## Licença

Proprietário. Todos os direitos reservados.
