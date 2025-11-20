# Instrucciones de Copilot para Votapp

## 📋 ¿Qué es Votapp?
**Votapp** es una plataforma de votación digital orientada a democratizar procesos participativos. Permite a organizaciones, instituciones educativas y comunidades crear, gestionar y participar en votaciones online con visualización de resultados en tiempo real. La versión MVP prioriza accesibilidad y simplicidad sin requerir conocimientos técnicos avanzados por parte de los usuarios.

**Estado actual de la implementación**: MVP 1 (frontend cliente con React; integración backend pendiente)

---

## Resumen del Proyecto
**Votapp** es una aplicación full-stack dividida en:
- **Frontend**: React + Vite + Tailwind CSS (carpeta `Frontend.Votapp/`)
- **Backend**: ASP.NET Core (entorno objetivo .NET 9) con Clean Architecture (carpeta `Backend.Votapp/`)

El frontend es un sistema de votación cliente con gestión de estado en memoria (`localStorage`) y sin integración de API por ahora. Los usuarios pueden crear, unirse y participar en votaciones con actualizaciones de UI en tiempo real.

## Arquitectura y Flujo de Datos

### Arquitectura Frontend (React)
- **`App.jsx`**: Centro del estado global usando `useState` y `useReducer` donde se almacenan:
  - `currentUser`: estado de autenticación (JSON en `localStorage`)
  - `votaciones`: arreglo de objetos de votación (persistido en `localStorage`)
  - `view`: vista actual (por ejemplo: `'dashboard'`, `'crear'`, `'votacion'`, `'resultados'`)
  - `toasts` / `success`: notificaciones y modales de retroalimentación

- **Persistencia de estado**:
  - Usuario → `localStorage['votapp_user']`
  - Votaciones → `localStorage['votapp_votes']`

- **Patrón de enrutado de vistas**: actualmente no se utiliza React Router; `App.jsx` renderiza condicionalmente las vistas según `view`:
  ```jsx
  {view === 'dashboard' && <Dashboard ... />}
  {view === 'crear' && <CreateVote ... />}
  // etc.
  ```

### Modelo de Datos: Objeto Votación
```js
{
  id: 'votacion-{timestamp}',
  titulo: string,
  descripcion: string,
  fechaInicio: string, // ISO
  fechaCierre: string, // ISO
  estado: 'Paused' | 'Activa' | 'Finalizada',
  codigoAcceso: 'ABC123',
  creadorId: 'user-{timestamp}',
  opciones: ['Opción 1', 'Opción 2', ...],
  participantes: number,
  votos: [{ userId, opcionIndex, timestamp }, ...]
}
```

### Jerarquía de Componentes
- `Sidebar.jsx`: menú de navegación (fijo en desktop, togglable en mobile)
- `Toast.jsx`: notificaciones autocancelables (3s por defecto)
- `SuccessModal.jsx`: modal para compartir código tras crear votación
- Vistas: `Dashboard`, `CreateVote`, `EditVote`, `JoinVote`, `Vote`, `Results`, `ConsultarVote`
- Gráficos: `BarChart`, `PieChart` (Chart.js + react-chartjs-2)

## Patrones de Desarrollo (Frontend)

- Usa `useCallback` para handlers pasados a hijos (ej. `navigate`, `addToast`)
- Usa `useMemo` para estados derivados (ej. `current = useMemo(() => findById(currentId), [currentId])`)
- Mantén el estado de formularios local con `useState` dentro del componente
- Evita prop drilling más de 2 niveles: eleva estado o usa Context cuando sea necesario

### Convenciones de eventos y handlers
- Props con patrón `on{Action}`: `onNavigate`, `onCreate`, `onEmitVote`
- Handlers con prefijo `handle`: `handleLogin`, `handleSubmit`
- Navegación interna vía `navigate(viewName, optionalId)`

### Estilos y Tailwind
- Enfoque utility-first: clases Tailwind directamente en JSX
- Responsive: usar `lg:` para estilos de escritorio
- Esquema de color: `teal-600` primary, `slate-900` dark

### Patrones UI comunes
- Notificaciones: `addToast(message, type)` → auto-dismiss 3s, tipos: `success|error|warning|info`
- Confirmaciones: modal de success para compartir código
- Formularios: usar `FormData(event.currentTarget)` y `form.get('campo')`

## Integración con API (WIP)
- `src/services/api.js` exporta una instancia de `axios`
  - Base URL desde `VITE_API_URL` (por defecto `http://localhost:3000`)
  - Actualmente sin endpoints de votación implementados

## Comandos de Desarrollo
- `npm run dev` → iniciar Vite en desarrollo (HMR)
- `npm run build` → build de producción a `dist/`
- `npm run lint` → ejecutar ESLint
- `npm run preview` → vista previa del build de producción

## Dependencias Clave
- `react`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `axios`, `chart.js`, `react-chartjs-2`

## Notas Importantes de Implementación

### Lógica de votación (principales reglas)
- Registro de voto: seleccionar opción → `emitVote()` añade el voto al arreglo `votos`
- Validación: `isVotacionActiva()` comprueba ventana temporal y `estado === 'Activa'`
- Prevención de duplicados: verificar `currentUser.id` en `votos` antes de aceptar (RN-02)
- Resultados calculados desde `votos` en memoria (sin persistencia aún)

### Generación de códigos
- `generateCode()`: código de 6 caracteres alfanuméricos (excluir caracteres ambiguos)
- Debe garantizar unicidad (RN-05)

### Responsividad móvil
- Sidebar fijo en `lg:`; en móvil usar menú hamburguesa
- Contenido principal full-width en móvil; `lg:pl-64` en escritorio

### Estados de votación
- `Paused`: estado inicial tras crear; permite edición
- `Activa`: período de votación (acepta votos)
- `Finalizada`: no acepta más votos; transición automática en `fechaCierre`

---

## 🎯 Directrices para el Agente AI (Copilot)

Antes de implementar una funcionalidad:
1. Identificar RF (requerimientos funcionales) relacionados
2. Validar contra RN (reglas de negocio) relevantes
3. Verificar RNF (no funcionales) críticos: performance y usabilidad

Reglas críticas a verificar en código:
- **RN-02**: Un voto por usuario por votación
- **RN-03**: Votación debe tener ≥2 opciones
- **RN-04**: Votos sólo durante ventana configurada
- **RN-05**: Códigos únicos por votación
- **RN-07**: Sólo el creador puede editar/eliminar mientras esté `Paused`

Buenas prácticas al integrar el backend:
- Actualizar `src/services/api.js` con endpoints
- Reemplazar gradualmente llamadas a `localStorage` por llamadas a API
- Usar interceptores de axios para JWT

---

## Documentos y Referencias
- Documentos clave: Acta de Constitución, Requerimientos, Epics, Casos de Uso, Historias de Usuario
- Archivos importantes en repo:
  - `src/App.jsx`, `src/views/CreateVote.jsx`, `src/views/Vote.jsx`, `src/views/Results.jsx`, `src/components/Sidebar.jsx`, `src/services/api.js`

---

# CHARTER & REQUERIMIENTOS (Resumen)

> El contenido completo del Acta de Constitución, Matriz de Trazabilidad y Requerimientos se mantiene en los documentos de `.github/` y en `copilot-instructions.md` para referencia rápida.

---

## Próximo paso
He traducido `copilot-instructions.md` al español e internacionalizado los términos técnicos necesarios en inglés. A continuación limpiaré los archivos en inglés obsoletos en `.github/`.


| ID | Requirement | Priority |
|----|-------------|----------|
| RF-P01 | Join votation via access code | Alta |
| RF-P02 | Verify voter identity before voting | Alta |
| RF-P03 | Enforce single vote per user per votation | Alta |
| RF-P04 | Show confirmation feedback after vote | Alta |

#### **RF-R: Results Module**
| ID | Requirement | Priority |
|----|-------------|----------|
| RF-R01 | Display real-time updated results | Alta |
| RF-R02 | Restrict access by role | Alta |
| RF-R03 | Show vote counts & percentages | Alta |
| RF-R04 | Visualize via dynamic graphs | Media |

#### **RF-T: Technical**
| ID | Requirement | Priority |
|----|-------------|----------|
| RF-T01 | Log execution events for debugging | Media |
| RF-T02 | Handle errors with clear user messages | Alta |
| RF-T03 | Simple, clear React interface | Alta |

### 2.3 Non-Functional Requirements (RNF)

| ID | Type | Requirement |
|----|------|-------------|
| RNF-01 | Performance | Vote registration in < 5 seconds |
| RNF-02 | Security | JWT-based authentication for all requests |
| RNF-03 | Usability | Simple, clear, usable UI |
| RNF-04 | Portability | Works on modern desktop browsers |
| RNF-05 | Maintainability (Backend) | Clean Architecture (Domain, Application, Infrastructure, Presentation) |
| RNF-06 | Persistence | Entity Framework Core + MySQL/PostgreSQL |
| RNF-07 | Real-Time Communication | SignalR for result updates |
| RNF-08 | Architecture | ASP.NET Core 8+ WebAPI + React 18+ |
| RNF-09 | Tech Stack | Open source or free only |
| RNF-10 | Diagnostics | Logging for debugging (no audit trail in MVP 1) |
| RNF-11 | Maintainability (Frontend) | Modular React components, separation of concerns |

### 2.4 Business Rules (RN)

| ID | Rule | Justification |
|----|------|---------------|
| RN-01 | One role per votation per user | Prevents conflicts of interest, ensures transparency |
| RN-02 | One vote per user per votation | Electoral equity principle |
| RN-03 | Votation must have ≥2 options | Ensures plurality of choice |
| RN-04 | Votes only during configured period | Temporal policy governing votation validity |
| RN-05 | Each votation has unique room code | Unambiguous identification, prevents collisions |
| RN-06 | Votation requires ≥2 options to activate | Integrity rule ensuring meaningful votations |
| RN-07 | Only creator can modify/delete until start; immutable after start | Ownership & responsibility policy |
| RN-08 | Votes are immutable after emission | Ballot immutability principle |
| RN-09 | Votation states: Active, Paused, Finalized | Formal lifecycle definition |
| RN-10 | Votation auto-closes at end date | Automatic temporal compliance |

---

## 3️⃣ EPICS

| Epic ID | Name | Objective | Actors | Key CU |
|---------|------|-----------|--------|--------|
| **E01** | User & Role Management | Registration, auth, profile mgmt with dynamic role assignment | User, System | CU01 |
| **E02** | Votation Administration | Creation, configuration, editing, deletion, state control | Administrator, System | CU02 |
| **E03** | Votation Participation | Code-based access, identity verification, single vote, feedback | Voter, System | CU03 |
| **E04** | Result Visualization | Real-time display, role-based access, dynamic graphs | Admin/Voter, System | CU04 |
| **E05** | Monitoring & Support | Logging, error handling, system diagnostics | Developer, System | CU05 |

---

## 4️⃣ USE CASES (Kaplan Level)

### **CU01 – Manage Users & Roles** (E01)
**Associated RF:** RF-U01 to RF-U05  
**Associated RN:** RN-01

**Flow:**
1. New user → Registration form (email + password)
2. System validates email uniqueness
3. User authenticates with JWT token
4. Role assigned dynamically (Admin if creates votation, Voter if participates)
5. User can edit profile or recover password

---

### **CU02 – Administer Votations** (E02)
**Associated RF:** RF-V01 to RF-V06  
**Associated RN:** RN-03, RN-05, RN-06, RN-07, RN-09, RN-10

**Flow:**
1. Admin selects "Create Votation"
2. Completes fields: title, description, options (≥2), start/end dates
3. System validates data and generates unique room code
4. Votation saved with "Paused" state
5. Admin can edit (if Paused) or delete at any time

---

### **CU03 – Participate in Votations** (E03)
**Associated RF:** RF-P01 to RF-P04  
**Associated RN:** RN-02, RN-04, RN-08

**Flow:**
1. Voter enters votation code
2. System validates code and votation active period
3. Voter verifies identity and sees available options
4. Voter selects and confirms vote
5. System registers immutable vote and shows confirmation
6. Results update in real-time

---

### **CU04 – Visualize Results** (E04)
**Associated RF:** RF-R01 to RF-R04  
**Associated RN:** RN-01, RN-08, RN-09

**Flow:**
1. User selects votation to view
2. System retrieves results based on user role
3. Admin sees complete results; Voter sees partial/percentages
4. Results display in real-time via SignalR with dynamic graphs

---

### **CU05 – Monitor System** (E05)
**Associated RF:** RF-T01 to RF-T03  
**Associated RN:** RN-10

**Flow:**
1. System automatically logs events and errors
2. Developer accesses logs module
3. Filters by severity or date
4. Analyzes events and performs corrective actions

---

## 5️⃣ USER STORIES (INVEST + SMART)

### **👤 USERS MODULE (E01)**

#### **HU-U01** – User Registration
```
As a new user, I want to register with email and password
So I can access the platform and participate in votations

Acceptance Criteria (SMART):
✓ Valid email format & uniqueness validation
✓ Registration completes in <5 seconds
✓ Credentials encrypted in persistence
✓ User receives success confirmation

Priority: HIGH | Est: 5 pts | RF-U01 | RN-01
```

#### **HU-U02** – Secure Authentication
```
As a registered user, I want to authenticate via JWT
So I can securely access my votations

Acceptance Criteria (SMART):
✓ JWT token signed with defined expiration
✓ Invalid credentials → HTTP 401
✓ Auto-token renewal before expiry

Priority: HIGH | Est: 3 pts | RF-U02 | RN-01
```

#### **HU-U03** – Edit Profile
```
As an authenticated user, I want to edit my profile
So I can keep my data updated

Acceptance Criteria (SMART):
✓ Allow modify name, email, password
✓ Require auth validation
✓ Apply changes in <5 seconds

Priority: MEDIUM | Est: 5 pts | RF-U04 | RN-01
```

#### **HU-U04** – Password Recovery
```
As a user who forgot my password, I want to recover it via email
So I can regain access without support

Acceptance Criteria (SMART):
✓ Send secure reset link to email
✓ Link expires in 15 minutes
✓ Password updated with encryption

Priority: LOW | Est: 3 pts | RF-U05 | RN-01
```

---

### **🗳️ VOTATIONS MODULE (E02)**

#### **HU-V01** – Create Votation
```
As an administrator, I want to create a votation with title, description, and ≥2 options
So I can initiate a participatory decision process

Acceptance Criteria (SMART):
✓ Validate minimum 2 options
✓ Auto-generate unique room code
✓ Registration in <5 seconds

Priority: HIGH | Est: 8 pts | RF-V01–V04 | RN-03, RN-05, RN-07
```

#### **HU-V02** – Configure Votation Period
```
As an administrator, I want to set start and end dates
So I can control the active participation window

Acceptance Criteria (SMART):
✓ Validate start < end dates
✓ Block votes outside range
✓ Auto-close at end date

Priority: HIGH | Est: 5 pts | RF-V05 | RN-04, RN-10
```

#### **HU-V03** – Edit Paused Votation
```
As an administrator, I want to edit a paused votation
So I can correct errors before activation

Acceptance Criteria (SMART):
✓ Only allow if state = "Paused"
✓ Validate edited fields
✓ Confirm update in <5 seconds

Priority: MEDIUM | Est: 5 pts | RF-V06 | RN-07
```

#### **HU-V04** – Delete Votation
```
As an administrator, I want to delete a votation
So I can remove unnecessary or erroneous processes

Acceptance Criteria (SMART):
✓ Only creator or authorized role can delete
✓ Request confirmation before deletion
✓ Register in audit logs

Priority: MEDIUM | Est: 3 pts | RF-V03 | RN-07
```

#### **HU-V05** – Manage Votation States
```
As an administrator, I want to manage votation states
So I can control its lifecycle (Active, Paused, Finalized)

Acceptance Criteria (SMART):
✓ Allow state change per permissions
✓ Auto-update availability
✓ Log each change with timestamp

Priority: HIGH | Est: 5 pts | RF-V06 | RN-04, RN-09
```

---

### **✅ PARTICIPATION MODULE (E03)**

#### **HU-P01** – Join via Access Code
```
As a voter, I want to join a votation using an access code
So I can participate in the correct, authorized process

Acceptance Criteria (SMART):
✓ Validate active, valid code
✓ Show error if code invalid
✓ Block access if votation finalized

Priority: HIGH | Est: 3 pts | RF-P01 | RN-05
```

#### **HU-P02** – Emit Single Vote
```
As a voter, I want to emit a single vote
So I can participate validly and transparently

Acceptance Criteria (SMART):
✓ Verify voter identity
✓ Enforce single vote per votation
✓ Show visual confirmation

Priority: HIGH | Est: 5 pts | RF-P02–P04 | RN-02, RN-08
```

---

### **📊 RESULTS MODULE (E04)**

#### **HU-R01** – Real-Time Results
```
As an administrator, I want to view real-time results
So I can analyze participation and vote trends

Acceptance Criteria (SMART):
✓ Auto-update after each vote
✓ Access restricted by role
✓ Dynamic graphs and percentages

Priority: HIGH | Est: 8 pts | RF-R01–R04 | RN-01, RN-09
```

#### **HU-R02** – Restrict Result Access
```
As an administrator, I want to restrict full results by role
So I maintain transparency and data confidentiality

Acceptance Criteria (SMART):
✓ Only authorized roles see full details
✓ Voters see partial/percentage data only
✓ Restrictions auto-applied in rendering

Priority: HIGH | Est: 4 pts | RF-R02 | RN-09
```

---

### **⚙️ MONITORING & SUPPORT (E05)**

#### **HU-T01** – System Logging
```
As a developer, I want to log system events and errors
So I can detect and resolve failures proactively

Acceptance Criteria (SMART):
✓ Logs with timestamp & severity level
✓ Access restricted to technical staff
✓ Auto-log critical errors

Priority: MEDIUM | Est: 3 pts | RF-T01 | RN-10
```

#### **HU-T02** – Clear Error Messages
```
As a user, I want clear error messages
So I understand problems and take corrective action

Acceptance Criteria (SMART):
✓ Explain issue without sensitive data
✓ Show in <2 seconds after error
✓ Include cause and possible solution

Priority: HIGH | Est: 4 pts | RF-T02 | RNF-03
```

---

## 6️⃣ TRACEABILITY MATRIX

| Epic | Use Cases | User Stories |
|------|-----------|--------------|
| **E01** | CU01 | HU-U01, HU-U02, HU-U03, HU-U04 |
| **E02** | CU02 | HU-V01, HU-V02, HU-V03, HU-V04, HU-V05 |
| **E03** | CU03 | HU-P01, HU-P02 |
| **E04** | CU04 | HU-R01, HU-R02 |
| **E05** | CU05 | HU-T01, HU-T02 |

**Traceability Path:** HU ↔ RF ↔ RN ↔ Epic ↔ CU (Complete bidirectional coverage)

---

## 🔁 Actualizaciones (2025-11-20)

Se han incorporado decisiones técnicas y documentación adicional al repositorio para orientar la implementación backend del MVP. Si ya trabajas con este archivo, revisa las referencias a continuación y los documentos asociados en `.github/`.

- **Documentos nuevos / actualizados**:
  - `.github/WORKFLOW_SISTEMA.md`: workflow completo del sistema (registro, ciclo de vida de votaciones, participación contextual, manejo de race conditions, autorización basada en recursos, arquitectura de BD).
  - `.github/Respuestas de Copilot/CHECKLIST_IMPLEMENTACION_BACKEND.md`: checklist ampliado por fases (0–4) con ejemplos de código, mapeos de `DbContext`, repositorios, UnitOfWork, controllers y handlers de autorización.

- **Decisiones técnicas clave**:
  - Persistencia: usar **Entity Framework Core** con **MySQL** (migraciones EF y constraints en la BD).
  - Entidades críticas: `Votacion` (Aggregate Root), `Participacion` (rol contextual por votación) y `Voto`.
  - Integridad y race conditions:
    - Añadir índice UNIQUE en `Votos` sobre `(VotacionId, UsuarioId)` para garantizar RN-02 (un voto por usuario por votación).
    - Añadir índice UNIQUE en `Participaciones` sobre `(UsuarioId, VotacionId)` para garantizar RN-01 (un rol por usuario por votación).
    - Manejar `DbUpdateException` en la capa de repositorios/casos de uso para convertir violaciones de constraint en errores de negocio controlados.
  - Autorización: usar **authorization handlers** (resource-based) registrados en `Program.cs` para evaluar roles por votación (ej.: `SoyAdministradorVotacionRequirement` / `SoyVotanteActivoRequirement`). Las comprobaciones consultan la tabla `Participaciones`.
  - Seguridad: autenticación **JWT Bearer**; usar claims (`sub`) para identificar `UsuarioId` en handlers y controllers.
  - Real-time: planificar **SignalR** para emisión de resultados en tiempo real (PR / módulo dedicado).

- **Práctica de PRs (PR-by-PR)**:
  - PR1: estructura de solución y proyectos base (FASE 0).
  - PR2: entidades del dominio (FASE 1) — incluir `Participacion` y enums.
  - PR3: `VotappDbContext` y migración inicial (FASE 3) — incluir constraints UNIQUE para `Votos`, `Participaciones`, `Votacion.CodigoAcceso`.
  - PR4: repositorios, UnitOfWork y casos de uso (FASE 2/3) — incluir manejo de `DbUpdateException`.
  - PR5: controllers, JWT, policies/handlers de autorización (FASE 4).
  - PR6: SignalR y emisión de eventos en tiempo real.
  - PR7: tests de integración y CI.

- **Notas operativas**:
  - Documenta en cada PR los pasos de migración: `dotnet ef migrations add <name>` y `dotnet ef database update` y adjunta la salida o screenshots si procede.
  - Para evitar flujos de trabajo peligrosos en producción, aplica constraints en la BD desde la primera migración y deja la capa de aplicación para manejar errores legibles al usuario.
  - Considerar un servicio background (hosted service) para el auto-cierre de votaciones (`RN-10`) o triggers en BD si la infraestructura lo permite.

Si quieres, puedo aplicar estos cambios de documentación al archivo `GUIA_DESARROLLO_BACKEND.md` y/o crear la rama `feature/backend-skeleton` con los POCOs, `VotappDbContext`, repositorios y controllers iniciales. Indica la opción que prefieres.
