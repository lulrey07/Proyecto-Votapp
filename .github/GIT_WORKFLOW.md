# 📚 Guía de Git & GitHub Workflow - Votapp

**Última actualización:** 16 de noviembre de 2025  
**Proyecto:** Votapp (Full-Stack: React + ASP.NET Core)

---

## 📑 Tabla de Contenidos

1. [Estrategia de Branching](#estrategia-de-branching-git-flow)
2. [Estructura del Repositorio](#estructura-del-repositorio)
3. [Convenciones de Commits](#convenciones-de-commits)
4. [Configuración de GitHub](#configuración-de-github)
5. [Workflow de Desarrollo Diario](#workflow-de-desarrollo-diario)
6. [Merges y Pull Requests](#merges-y-pull-requests)
7. [Checklist Inicial](#checklist-inicial)
8. [Recomendaciones Adicionales](#recomendaciones-adicionales)

---

## 🌳 Estrategia de Branching: Git Flow

Usaremos **Git Flow** adaptado al proyecto. Es ideal para proyectos con ciclos de release planificados.

### Tipos de Ramas Principales

```
main (producción)
  ↑
release/* (pre-release)
  ↑
develop (integración)
  ↑
feature/*, bugfix/*, hotfix/*
```

### 1. **main** - Rama de Producción
- **Protegida**: solo merges desde `release/` o `hotfix/`
- **Tags**: cada merge debe tener un tag de versión (`v1.0.0`)
- **Regla**: siempre debe estar en estado deployable
- **Trigger**: despliegue automático (CD pipeline)

### 2. **develop** - Rama de Integración
- **Base para features**: todas las features arrancan de `develop`
- **Protected**: solo merges desde PRs (code review requerido)
- **Ciclo**: acumula features hasta preparar un release

### 3. **feature/** - Ramas de Características
**Nomenclatura:** `feature/HU-{id}-{descripcion-corta}`

Ejemplos:
```
feature/HU-U01-user-registration
feature/HU-V01-create-votation
feature/RF-R01-real-time-results
```

**Origen:** `develop`  
**Destino:** `develop` (vía PR)  
**Duración:** 3-14 días típicamente

### 4. **bugfix/** - Ramas de Correcciones
**Nomenclatura:** `bugfix/{issue-id}-{descripcion}`

Ejemplos:
```
bugfix/ISSUE-42-vote-duplicate-bug
bugfix/ISSUE-15-sidebar-responsive
```

**Origen:** `develop`  
**Destino:** `develop` (vía PR)

### 5. **hotfix/** - Correcciones Críticas en Producción
**Nomenclatura:** `hotfix/{version}-{descripcion}`

Ejemplos:
```
hotfix/v1.0.1-auth-token-expired
hotfix/v1.1.0-security-xss-patch
```

**Origen:** `main`  
**Destino:** `main` + `develop` (ambas vía PR)  
**Urgencia:** despliegue inmediato

### 6. **release/** - Preparación de Liberación
**Nomenclatura:** `release/{version}`

Ejemplos:
```
release/v1.0.0
release/v1.1.0-beta
```

**Origen:** `develop`  
**Destino:** `main` (vía PR) + back-merge a `develop`  
**Actividades:** bump versión, últimos fixes, documentación

---

## 📁 Estructura del Repositorio

```
Proyecto Votapp/
├── .github/
│   ├── workflows/              # ⭐ CI/CD pipelines
│   │   ├── ci.yml
│   │   ├── cd-frontend.yml
│   │   └── cd-backend.yml
│   ├── ISSUE_TEMPLATE/         # Plantillas de issues
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── GIT_WORKFLOW.md         # ⭐ Este documento
│   ├── CHECKLIST_IMPLEMENTACION_BACKEND.md # Plan PR-by-PR y checklist de backend
│   ├── copilot-instructions.md
│   └── CONTRIBUTING.md         # Guía de contribución
├── .gitignore
├── .editorconfig               # ⭐ Configuración de editor (recomendado)
├── Backend.Votapp/
│   ├── global.json
│   ├── Backend.Votapp.sln
│   ├── src/
│   │   ├── Votapp.API/
│   │   ├── Votapp.Application/
│   │   ├── Votapp.Domain/
│   │   └── Votapp.Infrastructure/
│   ├── tests/                  # ⭐ Tests unitarios
│   └── README.md
├── Frontend.Votapp/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   ├── tests/                  # ⭐ Tests con Vitest
│   └── README.md
├── docs/                       # ⭐ Documentación del proyecto
│   ├── ARCHITECTURE.md
│   ├── API_SPECS.md
│   └── DEPLOYMENT.md
├── README.md                   # Descripción general
└── CHANGELOG.md                # ⭐ Historial de cambios
```

### Recomendación: Agregar Estructura de Tests

```bash
# Backend
Backend.Votapp/tests/
├── Votapp.Application.Tests/
├── Votapp.Domain.Tests/
└── Votapp.Infrastructure.Tests/

# Frontend
Frontend.Votapp/src/__tests__/
├── components/
├── services/
└── views/
```

---

## 💬 Convenciones de Commits

### Formato: Conventional Commits

```
<tipo>(<scope>): <descripción corta>

<cuerpo opcional>

<footer opcional>
```

### Tipos de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **feat** | Nueva característica | `feat(voting): add real-time results` |
| **fix** | Corrección de bug | `fix(auth): prevent duplicate votes` |
| **docs** | Cambios en documentación | `docs(README): update setup instructions` |
| **style** | Formato, sin cambios lógicos | `style(frontend): format JSX files` |
| **refactor** | Refactorización sin feat/fix | `refactor(api): simplify vote service` |
| **perf** | Mejora de performance | `perf(results): optimize chart rendering` |
| **test** | Agregar/modificar tests | `test(domain): add vote validation tests` |
| **chore** | Tareas de mantenimiento | `chore(deps): update dependencies` |
| **ci** | Cambios en CI/CD | `ci(workflow): add linting to pipeline` |

### Scope (opciones recomendadas)

```
Backend:
- auth, voting, results, admin, user, infrastructure, persistence

Frontend:
- components, views, services, state, routing, styling

Shared:
- config, docs, docker, github
```

### Ejemplos Completos

**Feature con cuerpo:**
```
feat(voting): add vote confirmation modal

- Show option selected before final submission
- Add 3-second confirmation timer
- Auto-dismiss on timeout

Closes #42
```

**Bugfix simple:**
```
fix(sidebar): correct responsive breakpoint on mobile

La barra lateral no colapsaba correctamente en pantallas < 768px
```

**Refactor:**
```
refactor(api): extract vote validation logic to service

- Create VoteValidationService in Application layer
- Reduce duplication across endpoints
- Improve testability
```

---

## ⚙️ Configuración de GitHub

### 1. Proteger Ramas Principales

**Configuración → Branches → Branch protection rules**

#### Para `main`:
- ✅ Require pull request reviews before merging (≥1 revisor)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - CI (linting, tests)
  - CD checks
- ✅ Require branches to be up to date before merging
- ✅ Require approval from code owners
- ✅ Restrict who can push to matching branches

#### Para `develop`:
- ✅ Require pull request reviews before merging (≥1 revisor)
- ✅ Require status checks to pass before merging
- ✅ Allow force pushes: **NO**
- ⚠️ Requerir reviews de específico scope (Backend vs Frontend)

### 2. Configurar CODEOWNERS

Crear `.github/CODEOWNERS`:

```
# Propietarios del código por área

# Backend
Backend.Votapp/ @tu-usuario
Backend.Votapp/src/Votapp.Domain/ @tu-usuario
Backend.Votapp/src/Votapp.Application/ @tu-usuario

# Frontend
Frontend.Votapp/ @tu-usuario
Frontend.Votapp/src/views/ @tu-usuario

# Configuración global
.github/ @tu-usuario
.gitignore @tu-usuario
```

### 3. Configurar Labels Personalizados

**Issues → Labels**

Crear labels por categoría:

```
Type:
  - bug (rojo)
  - enhancement (azul)
  - documentation (púrpura)
  - question (gris)

Priority:
  - priority: critical (rojo oscuro)
  - priority: high (naranja)
  - priority: medium (amarillo)
  - priority: low (verde)

Status:
  - status: in-progress (azul)
  - status: blocked (rojo)
  - status: review (púrpura)
  - status: done (verde)

Area:
  - area: frontend (celeste)
  - area: backend (azul marino)
  - area: devops (gris)
  - area: docs (púrpura claro)
```

### 4. Plantillas de Issues y PRs

Crear `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: 🐛 Bug Report
about: Reportar un error o comportamiento inesperado
title: "[BUG] "
labels: bug
assignees: ''
---

## 📝 Descripción
<!-- Describe brevemente el bug -->

## 🔄 Pasos para Reproducir
1. ...
2. ...
3. ...

## ✅ Comportamiento Esperado
<!-- Qué debería suceder -->

## ❌ Comportamiento Actual
<!-- Qué sucede en realidad -->

## 📷 Screenshots
<!-- Si aplica -->

## 🖥️ Entorno
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Versión del Proyecto: [e.g., v1.0.0-beta]

## 🎯 Prioridad
- [ ] Crítico (bloquea funcionalidad)
- [ ] Alto (afecta experiencia)
- [ ] Medio (es un inconveniente)
- [ ] Bajo (cosmético)
```

Crear `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 📌 Descripción
<!-- Describe brevemente qué cambios incluye este PR -->

## 🎯 Tipo de Cambio
- [ ] ✨ Característica nueva
- [ ] 🐛 Corrección de bug
- [ ] 📚 Documentación
- [ ] ♻️ Refactorización
- [ ] 🔧 Configuración

## 📝 Issues Relacionados
Cierra #(issue number)

## ✅ Checklist

### General
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He actualizado la documentación relevante
- [ ] He agregado tests para los cambios

### Backend (si aplica)
- [ ] El código compila sin errores
- [ ] Todos los tests pasan: `dotnet test`
- [ ] He seguido Clean Architecture
- [ ] No hay warnings en build

### Frontend (si aplica)
- [ ] El código pasa linting: `npm run lint`
- [ ] Los tests pasan: `npm run test`
- [ ] He probado responsividad (mobile/desktop)
- [ ] Sin warnings de build

### Seguridad
- [ ] No hay credenciales/secrets en el código
- [ ] Validé inputs de usuario
- [ ] No hay vulnerabilidades conocidas

## 🎬 Demo
<!-- Link a demo si aplica, o describir cómo probar -->

## 📸 Screenshots
<!-- Si es UI, agregar antes/después -->

## 🚨 Breaking Changes
<!-- Documenta si hay cambios que rompan compatibilidad -->
```

### 5. Habilitar Conversaciones Automáticas

**Settings → General → Pull requests**
- ✅ Allow auto-merge
- ✅ Auto-delete head branches

---

## 🚀 Workflow de Desarrollo Diario

### Inicio de Día

#### 1. Sincronizar tu máquina local

```bash
# Ir al repo
cd "c:\Users\franc\Proyecto Votapp"

# Asegurar que estás en develop
git checkout develop

# Traer cambios del remoto
git pull origin develop

# Actualizar submodules si existen
git submodule update --init --recursive
```

#### 2. Elegir tarea (HU/Issue)

Desde GitHub Issues, selecciona una tarea con prioridad alta sin asignar:
- Estado: `status: ready` o `status: todo`
- Asígnate la tarea
- Cambia etiqueta a `status: in-progress`

---

### Durante la Sesión de Desarrollo

#### 3. Crear rama de feature

```bash
# Nomenclatura: feature/HU-{id}-{descripcion}
git checkout -b feature/HU-U01-user-registration

# O para bugfix
git checkout -b bugfix/ISSUE-42-vote-duplicate

# Confirmar que estás en la rama nueva
git branch -v
```

#### 4. Hacer cambios y commits pequeños

**Principio: Commits atómicos**
- 1 commit = 1 cambio lógico
- Tamaño: ~100-400 líneas de código
- No mezcles features en 1 commit

Ejemplo bueno:

```bash
# Commit 1: Agregar modelo de votación
git add Backend.Votapp/src/Votapp.Domain/Entities/Votation.cs
git commit -m "feat(domain): add Votation entity with validation rules"

# Commit 2: Agregar servicio de aplicación
git add Backend.Votapp/src/Votapp.Application/Services/CreateVotationService.cs
git commit -m "feat(application): create service to handle votation creation"

# Commit 3: Agregar endpoint
git add Backend.Votapp/src/Votapp.API/Controllers/VotationsController.cs
git commit -m "feat(api): add POST /votations endpoint"

# Commit 4: Agregar tests
git add Backend.Votapp/tests/
git commit -m "test(application): add unit tests for CreateVotationService"
```

#### 5. Push frecuente (pero protegido)

```bash
# Hacer push cada 2-3 commits (o si terminas la sesión)
git push origin feature/HU-U01-user-registration

# Verificar que la rama está en el remoto
git branch -r -v
```

---

### Fin de Feature (Preparar PR)

#### 6. Asegurar que está actualizado

```bash
# Traer cambios recientes de develop
git fetch origin
git rebase origin/develop

# Si hay conflictos:
# 1. Resolver en VS Code
# 2. git add .
# 3. git rebase --continue
```

#### 7. Ejecutar validaciones locales

**Backend:**
```bash
cd Backend.Votapp

# Compilar
dotnet build

# Tests
dotnet test

# Linting/analysis (si tienes)
dotnet format --verify-no-changes
```

**Frontend:**
```bash
cd Frontend.Votapp

# Linting
npm run lint

# Tests
npm run test

# Build
npm run build
```

#### 8. Crear Pull Request

```bash
# Hacer push final
git push origin feature/HU-U01-user-registration
```

Luego en GitHub:
- **Compare & pull request**
- Título: `feat(auth): implement user registration endpoint`
- Descripción: completar template de PR
- Asignar reviewer
- Agregar labels (type, priority, area)
- Ligar a issues: `Closes #123`

---

## 🔄 Actualizar Ramas Remotas desde Local

Actualizar ramas remotas es fundamental en el flujo diario. Aquí están los escenarios principales:

### Escenario 1: Empujar cambios locales a remoto (Más común)

```bash
# Asegúrate de estar en la rama correcta
git checkout develop

# Verifica cambios locales
git status

# Haz commit si no lo hiciste
git add .
git commit -m "feat(voting): add validation logic"

# Empuja los cambios a remoto
git push origin develop

# O si es la primera vez (configura upstream)
git push -u origin develop
```

**Diferencia entre `git push origin develop` y `git push`:**

#### `git push origin develop` (Explícito)
```powershell
git push origin develop
```
- **Qué hace:** Empuja la rama local `develop` hacia `origin/develop` (remoto)
- **Sintaxis:** `git push <remoto> <rama-local>`
- **Ventaja:** Siempre funciona, sin importar la configuración de upstream
- **Recomendado para:** Cuando no tienes upstream configurado aún, o cuando quieres ser explícito

#### `git push` (Implícito - Usa Upstream)
```powershell
git push
```
- **Qué hace:** Empuja usando la rama "upstream" que configuraste
- **Requisito:** Debe tener upstream configurado (con `git push -u` antes)
- **Ventaja:** Más rápido, menos escribir
- **Recomendado para:** Flujo diario después de configurar upstream

**Ejemplo de flujo completo:**

```bash
# Primera vez: usar -u para configurar upstream
git push -u origin develop
# → Configura develop para rastrear origin/develop
# → Ahora puedes usar solo `git push` desde develop

# Próximas veces: basta con
git push
# → Git sabe que debe ir a origin/develop (ya está configurado)
```

**Tabla Comparativa:**

| Escenario | `git push origin develop` | `git push` |
|-----------|---------------------------|-----------|
| Primera vez subiendo rama | ✅ Funciona | ❌ Error: "no upstream" |
| Después de `git push -u` | ✅ Funciona | ✅ Funciona |
| Especificidad | Explícito (claro dónde va) | Implícito (depende de config) |
| Seguridad | Siempre seguro | Seguro si upstream es correcto |

**Recomendación para tu flujo:**

```powershell
# Tu primer push de HOY (configura upstream)
git checkout main
git push -u origin main

git checkout develop
git push -u origin develop

# Próximos pushes (diarios)
# Ya puedes usar:
git push  # ← Sin argumentos, Git sabe dónde ir
```

### Escenario 2: Tu rama local está atrás de remota (sincronizar)

```bash
# Opción A: Pull (trae y mergea automáticamente)
git pull origin develop

# Opción B: Fetch + Merge (más control)
git fetch origin
git merge origin/develop

# Opción C: Fetch + Rebase (historial más limpio)
git fetch origin
git rebase origin/develop
```

### Escenario 3: Crear nueva rama remota desde local

```bash
# Tienes una rama local feature/HU-U01-user-registration
# Quieres subirla por primera vez al remoto

git checkout feature/HU-U01-user-registration
git push -u origin feature/HU-U01-user-registration

# El flag -u configura upstream automáticamente
# Ahora `git push` funcionará desde esta rama
```

### Escenario 4: Forzar actualización (⚠️ Usar con cuidado)

```bash
# ⚠️ SOLO si estás 100% seguro de lo que haces
# Esto sobreescribe el historial remoto

# Opción A: Force push (destructivo)
git push --force origin develop

# Opción B: Force with lease (más seguro, rechaza si hay cambios remotos nuevos)
git push --force-with-lease origin develop
```

### Escenario 5: Sincronizar TODAS las ramas locales

```bash
# Traer información de TODAS las ramas remotas
git fetch origin

# Ver todas las ramas remotas
git branch -r

# Si quieres traer una rama remota que no tienes local
git checkout feature/HU-V01-create-votation
# Git automáticamente la crea local y la rastrea
```

### Tabla de Referencia Rápida

| Comando | Efecto | Cuándo |
|---------|--------|--------|
| `git push origin <rama>` | Empuja a remoto (explícito) | Siempre seguro |
| `git push -u origin <rama>` | Push + configura upstream | Primera vez en cada rama |
| `git push` | Usa upstream configurado | Después de `-u` |
| `git pull origin <rama>` | Trae cambios remotos | Sincronizar con remoto |
| `git fetch origin` | Descarga sin mergear | Ver cambios antes de integrar |
| `git push --force-with-lease` | Fuerza push (más seguro) | ⚠️ Solo si sabes qué haces |

---

## 📋 Merges y Pull Requests

### Ciclo de Revisión

```
1. Author crea PR
   ↓
2. Automated checks (CI)
   ├─ ❌ Falla → Author corrige y hace push
   └─ ✅ Pasa → Siguientes pasos
   ↓
3. Code Review (Reviewer)
   ├─ 💬 Comentarios → Author responde y ajusta
   ├─ 👎 Cambios solicitados → Back a paso 2
   └─ ✅ Aprobado → Siguientes pasos
   ↓
4. Merge (Author o Maintainer)
   ├─ Squash & merge (por defecto para features)
   └─ Cerrar rama remota
```

### Estrategia de Merge por Tipo

| Tipo de PR | Estrategia | Cuándo |
|-----------|-----------|--------|
| **Feature** | Squash & Merge | Múltiples commits internos, 1 commit limpio en develop |
| **Bugfix** | Squash & Merge | Igual que feature, simplifica historial |
| **Release** | Create a merge commit | Preservar historial de release |
| **Hotfix** | Create a merge commit | Importante preservar traceabilidad |

### Comandos Locales para Merge

**Opción 1: Merge desde GitHub UI (Recomendado)**
```
GitHub UI → "Squash and merge"
```

**Opción 2: Merge local**
```bash
git checkout develop
git pull origin develop
git merge --squash feature/HU-U01-user-registration
git commit -m "feat(auth): implement user registration endpoint

- Add UserService with registration logic
- Add UserController endpoint
- Add validation rules per RN-01
- Include unit tests

Closes #123"
git push origin develop
```

---

## ✅ Checklist Inicial

### 🔧 Configuración de Máquina

- [ ] Git instalado y configurado
  ```bash
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu-email@example.com"
  ```

- [ ] GitHub CLI instalado (opcional pero recomendado)
  ```bash
  # En PowerShell como admin
  winget install --id GitHub.cli
  gh auth login
  ```

- [ ] SSH key configurada en GitHub
  ```bash
  # Si no tienes
  ssh-keygen -t ed25519 -C "tu-email@example.com"
  # Agregar public key a GitHub Settings → SSH Keys
  ```

- [ ] `.gitconfig` personalizado
  ```bash
  # Opcional: alias útiles
  git config --global alias.st status
  git config --global alias.br branch
  git config --global alias.co checkout
  git config --global alias.unstage 'reset HEAD --'
  ```

### 📁 Configuración del Repositorio

- [ ] Clonar o sincronizar repositorio
  ```bash
  git clone git@github.com:tu-usuario/Proyecto-Votapp.git
  # o con HTTPS si no tienes SSH
  git clone https://github.com/tu-usuario/Proyecto-Votapp.git
  ```

- [ ] Crear ramas principales (si no existen)
  ```bash
  git branch main
  git branch develop
  git push origin main develop
  ```

- [ ] Proteger ramas en GitHub Settings
  - [ ] Proteger `main`
  - [ ] Proteger `develop`

- [ ] Configurar CODEOWNERS
  - [ ] Crear `.github/CODEOWNERS`

- [ ] Agregar plantillas de issues y PRs
  - [ ] `.github/ISSUE_TEMPLATE/bug_report.md`
  - [ ] `.github/PULL_REQUEST_TEMPLATE.md`

### 🎯 Configuración Local para Desarrollo

- [ ] Backend listo
  ```bash
  cd Backend.Votapp
  dotnet restore
  dotnet build
  ```

- [ ] Frontend listo
  ```bash
  cd Frontend.Votapp
  npm install
  npm run dev
  ```

- [ ] Tests funcionando
  ```bash
  # Backend
  dotnet test

  # Frontend
  npm run test
  ```

- [ ] Linting configurado
  ```bash
  # Frontend
  npm run lint

  # Backend (si tienes)
  dotnet format --verify-no-changes
  ```

### 📚 Documentación Completada

- [ ] README.md actualizado con instrucciones de setup
- [ ] GIT_WORKFLOW.md (este documento) en `.github/`
- [ ] CONTRIBUTING.md creado
- [ ] CHANGELOG.md iniciado

---

## 💡 Recomendaciones Adicionales

### 1. Git Hooks Locales (Prevenir Errores)

Instala **Husky** para automatizar validaciones:

**Frontend:**
```bash
cd Frontend.Votapp
npm install husky --save-dev
npx husky install

# Agregar hooks
npx husky add .husky/pre-commit "npm run lint-staged"
npx husky add .husky/pre-push "npm run test"
```

**Backend:**
```bash
# Crear script bash en repositorio
# .git/hooks/pre-commit

#!/bin/bash
cd Backend.Votapp
dotnet format --verify-no-changes
if [ $? -ne 0 ]; then
  echo "❌ Formatting issues. Run: dotnet format"
  exit 1
fi
```

### 2. Semantic Versioning

Usa **Semantic Versioning** para tags:

```
v{MAJOR}.{MINOR}.{PATCH}

- MAJOR: cambios incompatibles (v1.0.0 → v2.0.0)
- MINOR: features nuevas compatibles (v1.0.0 → v1.1.0)
- PATCH: bugfixes (v1.0.0 → v1.0.1)

Ejemplos:
v1.0.0-alpha     (pre-release)
v1.0.0-beta.1    (beta)
v1.0.0-rc.1      (release candidate)
v1.0.0           (estable)
```

**Crear tag:**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0: Initial MVP"
git push origin v1.0.0
```

### 3. .editorconfig para Consistencia

Crear `.editorconfig` en raíz:

```ini
root = true

# Todos
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

# C#
[*.cs]
indent_size = 4
indent_style = space

# JavaScript/React
[*.{js,jsx}]
indent_size = 2
indent_style = space
max_line_length = 100

# JSON
[*.json]
indent_size = 2
indent_style = space

# Markdown
[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

### 4. GitHub Actions Básicas (CI/CD)

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ develop, main, release/* ]
  pull_request:
    branches: [ develop, main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '9.0.0'
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build --verbosity normal

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 5. Comunicación en Commits

**Buen ejemplo de descripción de PR/commit:**

```
feat(votation): implement real-time results with WebSocket

## Descripción
Implementa actualización en tiempo real de resultados usando WebSocket 
(SignalR en backend, StompJS en frontend) para mejor UX.

## Cambios
- Backend: Agregar SignalR hub en Votapp.API/Hubs/VotationHub.cs
- Frontend: Conectar con useEffect en Results.jsx
- Tests: 8 tests unitarios nuevos

## Performance
- ⚡ Latencia: <100ms entre voto y actualización visual
- 💾 Sin impacto en memoria

## Riesgos & Mitigación
- Riesgo: Conexión inestable en 4G
- Mitigación: Implementar retry logic con exponential backoff

## Testing
- ✅ Tests en backend: 8/8 pasando
- ✅ Tests en frontend: 5/5 pasando
- ✅ Manual testing: OK en Chrome, Firefox, Safari
- ✅ Mobile testing: OK en iOS Safari, Android Chrome

## Checklist Pre-Merge
- [x] Código compilado sin errores
- [x] Tests pasando
- [x] Documentación actualizada (README.md)
- [x] Sin breaking changes
- [x] Review completado

## Related Issues
Closes #89
Related to #88
```

### 6. Monitoreo de Ramas

```bash
# Ver todas las ramas (local y remoto)
git branch -a -v

# Ver ramas antiguas (sin actividad)
git branch -v --no-color | grep "\[gone\]"

# Limpiar ramas locales eliminadas en remoto
git remote prune origin
```

### 7. Gestión de Conflictos

**Prevención:**
```bash
# Siempre rebase antes de PR
git fetch origin
git rebase origin/develop

# No merges innecesarios
git pull --rebase
```

**Resolución:**
```bash
# Ver conflictos
git status

# Editar archivos en conflicto (VS Code)
# Buscar: <<<<<<<, =======, >>>>>>>

# Marcar como resuelto
git add <archivo-resuelto>

# Continuar rebase
git rebase --continue

# Si quieres abortar
git rebase --abort
```

---

## 📞 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| **"Your branch is ahead of origin"** | `git push origin <rama>` |
| **"Pulling without specifying how to reconcile"** | `git config --global pull.rebase true` |
| **"detached HEAD"** | `git checkout develop` o `git checkout -b <nueva-rama>` |
| **"Accidental commit en main"** | `git reset --soft HEAD~1` + `git stash` + cambiar rama |
| **"Quiero deshacer commit local"** | `git reset --hard HEAD~1` (⚠️ destructivo) |
| **"Merge en conflicto"** | Resolver archivos + `git add .` + `git commit` |

---

## 🎓 Recursos y Lectura

- [Git Documentation oficial](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

## 📝 Resumen Rápido (Para Diario)

```bash
# Mañana: sincronizar
git checkout develop && git pull origin develop

# Crear feature
git checkout -b feature/HU-{id}-{desc}

# Durante: commits pequeños
git add <archivos específicos>
git commit -m "tipo(scope): descripción"

# Al terminar: push y PR
git push origin feature/HU-{id}-{desc}
# → Crear PR en GitHub UI

# Merge (desde GitHub): Squash & Merge

# Después: actualizar local
git checkout develop
git pull origin develop
```

---

**Última nota:** Este documento es vivo. Actualízalo cuando encuentres mejores prácticas o casos de uso específicos para Votapp.

