# 🔄 Workflow del Sistema Votapp - Flujo Completo

**Última actualización:** 19 de noviembre de 2025  
**Basado en:** Conversación con ChatGPT sobre roles dinámicos y participación contextual

---

## 📋 Tabla de Contenidos

1. [Visión General del Sistema](#visión-general-del-sistema)
2. [Flujo de Usuarios y Roles](#flujo-de-usuarios-y-roles)
3. [Ciclo de Vida de una Votación](#ciclo-de-vida-de-una-votación)
4. [Modelo de Participación Contextual](#modelo-de-participación-contextual)
5. [Arquitectura de Base de Datos](#arquitectura-de-base-de-datos)
6. [Flujos de Negocio Clave](#flujos-de-negocio-clave)
7. [Manejo de Race Conditions](#manejo-de-race-conditions)
8. [Autorización Basada en Recursos](#autorización-basada-en-recursos)

---

## 🎯 Visión General del Sistema

**Votapp** es una plataforma de votación donde:

- **Identidad global**: cada usuario tiene una cuenta única (email + password).
- **Rol contextual dinámico**: el rol de un usuario cambia según el contexto (votación, proyecto, etc.).
- **Participación explícita**: una votación existe en dos estados:
  1. **Paused** (Pausada): el creador puede editar opciones, fechas, etc.
  2. **Activa**: acepta votos según ventana temporal.
  3. **Finalizada**: cerrada, no acepta votos.

**Concepto clave**: un usuario puede ser:
- **Administrador** en la votación que él crea (control total).
- **Votante** en votaciones de otros usuarios (solo puede votar).

---

## 👥 Flujo de Usuarios y Roles

### 1. Registro e Inicio de Sesión

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO NUEVO entra a Votapp                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Pantalla de Registro (email, password, nombre completo)  │
│ 2. Backend valida:                                           │
│    - Email válido (RFC 5322)                                │
│    - Email único en Users tabla                             │
│    - Password >= 6 caracteres                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Crear registro en tabla USERS:                           │
│    {                                                         │
│      Id: GUID,                                              │
│      Email: "usuario@example.com",                          │
│      PasswordHash: bcrypt(password),  // Encriptado         │
│      NombreCompleto: "Juan Pérez",                          │
│      FechaCreacion: NOW(),                                  │
│      IsActive: true                                         │
│    }                                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Generar JWT token:                                       │
│    - Exp: +24 horas                                         │
│    - Claims: userId, email                                  │
│    - Enviar al frontend                                     │
└─────────────────────────────────────────────────────────────┘
```

**Regla de Negocio (RN-01)**: Cada usuario tiene identidad global. No hay roles globales por MVP (solo role contextual).

---

### 2. Creación de Votación (Usuario Como Administrador)

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario autenticado: Juan (userId = U1)                     │
│ Acción: "Crear Nueva Votación"                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Pantalla: Crear Votación                                 │
│    - Título (mín 5 caracteres)                              │
│    - Descripción                                            │
│    - Opciones (mín 2 requeridas - RN-03)                    │
│    - Fecha inicio / Fecha cierre (RN-04)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Backend valida con FluentValidation                      │
│    - Título no vacío, >= 5 caracteres                       │
│    - Opciones count >= 2                                    │
│    - FechaInicio < FechaCierre                              │
│    - Descripción no vacía                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Generar código de acceso único (RN-05):                  │
│    - 6 caracteres alfanuméricos                             │
│    - Excluir I, O, 1, L (ambigüedad visual)                 │
│    - Verificar en BD: INDEX UNIQUE(CodigoAcceso)            │
│    - Si colisiona: reintentar (máx 10 veces)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Crear transacción DB:                                    │
│    BEGIN TRANSACTION;                                       │
│                                                              │
│    INSERT INTO Votaciones {                                 │
│      Id: V1,                                                │
│      Titulo: "¿Qué color prefieres?",                       │
│      Descripcion: "Votación sobre color favorito",          │
│      CodigoAcceso: "X9Q7KJ",                                │
│      FechaInicio: "2025-11-20 10:00",                       │
│      FechaCierre: "2025-11-20 18:00",                       │
│      Estado: "Paused" (RN-07),                              │
│      CreadorId: U1,  -- Juan es creador                     │
│      FechaCreacion: NOW()                                   │
│    };                                                        │
│                                                              │
│    INSERT INTO VotacionOpciones {                           │
│      {Id: OP1, VotacionId: V1, Texto: "Azul", Orden: 0},   │
│      {Id: OP2, VotacionId: V1, Texto: "Rojo", Orden: 1},   │
│      {Id: OP3, VotacionId: V1, Texto: "Verde", Orden: 2}   │
│    };                                                        │
│                                                              │
│    INSERT INTO Participaciones {                            │
│      Id: P1,                                                │
│      UsuarioId: U1,     -- Juan                             │
│      VotacionId: V1,                                        │
│      Rol: "Administrador"  -- RN-01 contexto dinámico       │
│      FechaUnion: NOW()                                      │
│    };                                                        │
│    -- Índice UNIQUE(UsuarioId, VotacionId) previene dupl.  │
│                                                              │
│    COMMIT;                                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Respuesta al Frontend:                                   │
│    {                                                         │
│      success: true,                                         │
│      message: "Votación creada exitosamente",               │
│      data: {                                                │
│        id: "V1",                                            │
│        codigoAcceso: "X9Q7KJ"  -- IMPORTANTE: compartir    │
│      }                                                       │
│    }                                                         │
│                                                              │
│    Frontend muestra: "Comparte código: X9Q7KJ"              │
└─────────────────────────────────────────────────────────────┘
```

**Reglas aplicadas**:
- RN-01: Juan es automáticamente "Administrador" en su votación.
- RN-03: Validar >=2 opciones.
- RN-05: Código único.
- RN-07: Votación inicia en estado "Paused" (creador puede editar).

---

## 🗳️ Ciclo de Vida de una Votación

```
┌──────────────┐
│   PAUSED     │  (Estado inicial)
│   (Editable) │  - Creador puede cambiar opciones, fechas
└──────┬───────┘  - No acepta votos
       │          - No visible para otros
       │ (Administrador presiona "Activar")
       ▼
┌──────────────┐
│   ACTIVA     │  (Período de votación abierto)
│   (Votable)  │  - Acepta votos si FechaActual in [inicio, cierre]
└──────┬───────┘  - Otros usuarios pueden unirse por código
       │          - Visible para participantes
       │ (Automático: FechaActual >= FechaCierre)
       ▼          O (Administrador presiona "Cerrar")
┌──────────────┐
│  FINALIZADA  │  (Votación cerrada)
│  (Read-only) │  - NO acepta votos (RN-08 inmutabilidad)
└──────────────┘  - Resultados visibles para participantes
                  - Administrador ve dashboard con detalles
```

**Validaciones por estado**:
- **Paused**: Solo creador puede editar. No se permiten votos.
- **Activa**: Se permiten votos. Check ventana temporal (RN-04). Otros usuarios pueden unirse.
- **Finalizada**: No se permiten votos. Transición automática a `Finalizada` cuando `FechaActual >= FechaCierre`.

---

## 👥 Modelo de Participación Contextual

### Concepto: Tabla `Participaciones` (o `UsuarioVotacion`)

**Es la clave maestra del diseño**: vincula usuarios con votaciones y define el rol contextual.

```sql
-- Tabla: Participaciones
CREATE TABLE Participaciones (
    Id CHAR(36) PRIMARY KEY,
    UsuarioId CHAR(36) NOT NULL,       -- FK a Users
    VotacionId CHAR(36) NOT NULL,      -- FK a Votaciones
    Rol VARCHAR(30) NOT NULL,          -- 'Administrador' o 'Votante'
    FechaUnion DATETIME NOT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Users(Id),
    FOREIGN KEY (VotacionId) REFERENCES Votaciones(Id),
    UNIQUE (UsuarioId, VotacionId)    -- Un voto solo por usuario por votación
);
```

### Ejemplo: Dos Votaciones, Dos Roles

```
USUARIO: Juan (U1)
────────────────────────────────────────────
| Votacion ID | Rol           | Permisos                    |
|─────────────|───────────────|─────────────────────────────|
| V1          | Administrador | Crear, editar, ver dashboard|
| V2          | Votante       | Solo votar, ver resultados  |

USUARIO: María (U2)
────────────────────────────────────────────
| Votacion ID | Rol           | Permisos                    |
|─────────────|───────────────|─────────────────────────────|
| V1          | Votante       | Solo votar, ver resultados  |
| V2          | Administrador | Crear, editar, ver dashboard|
```

**Tabla Participaciones en BD**:
```
│ Id | UsuarioId | VotacionId | Rol           | FechaUnion          |
├────┼───────────┼────────────┼───────────────┼─────────────────────┤
│ P1 │ U1        │ V1         │ Administrador │ 2025-11-19 10:00:00 |
│ P2 │ U2        │ V1         │ Votante       │ 2025-11-19 10:15:00 |
│ P3 │ U2        │ V2         │ Administrador │ 2025-11-19 11:00:00 |
│ P4 │ U1        │ V2         │ Votante       │ 2025-11-19 11:05:00 |
└────┴───────────┴────────────┴───────────────┴─────────────────────┘
```

---

## 🔓 Flujo: Unirse a una Votación por Código

```
┌──────────────────────────────────────────────────────────┐
│ Usuario: Pedro (U3) entra a Votapp                       │
│ Acción: "Unirse a votación"                              │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 1. Pantalla: Ingresar Código de Acceso                   │
│    Input: "X9Q7KJ"                                       │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Backend valida:                                       │
│    SELECT * FROM Votaciones WHERE CodigoAcceso = X9Q7KJ  │
│    - Si NO existe → Error 404: "Código inválido"        │
│    - Si existe Y Estado = "Finalizada" → Error 403       │
│    - Si existe Y Estado != "Finalizada" → Continuar      │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Verificar que Pedro NO ya participa:                 │
│    SELECT * FROM Participaciones                         │
│    WHERE UsuarioId = U3 AND VotacionId = V1             │
│    - Si existe → Error 409: "Ya participas"             │
│    - Si NO existe → Continuar                            │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Insertar participación (transacción):                 │
│    BEGIN;                                                 │
│    INSERT INTO Participaciones {                         │
│      Id: GUID(),                                          │
│      UsuarioId: U3,                                       │
│      VotacionId: V1,                                      │
│      Rol: "Votante",  -- Siempre "Votante" al unirse     │
│      FechaUnion: NOW()                                    │
│    };                                                     │
│    COMMIT;                                                │
│                                                           │
│    (Si colisiona por UNIQUE → Error 409 capturado)      │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Respuesta:                                            │
│    {                                                      │
│      success: true,                                      │
│      message: "Te has unido a la votación",              │
│      data: {                                              │
│        votacionId: "V1",                                  │
│        titulo: "¿Qué color prefieres?",                   │
│        opciones: [...]                                    │
│      }                                                    │
│    }                                                      │
│                                                           │
│    Frontend redirige a pantalla de votación              │
└──────────────────────────────────────────────────────────┘
```

**Regla aplicada**: RN-01 (rol contextual dinámico) — Pedro es "Votante" en V1, pero puede ser "Administrador" en otra votación.

---

## 🗳️ Flujo: Emitir Voto (RN-02 Anti-Duplicados)

```
┌──────────────────────────────────────────────────────────┐
│ Usuario: Pedro (U3) está en votación V1                  │
│ Acción: Selecciona opción "Azul" (OP1) y presiona "Votar"│
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 1. Backend valida:                                       │
│    - ¿Pedro está autenticado? → Verificar JWT token      │
│    - ¿V1 existe?                                         │
│    - ¿V1.Estado == "Activa"?  (RN-04)                   │
│    - ¿FechaActual in [Inicio, Cierre]?                   │
│    - ¿OP1 pertenece a V1?                               │
│    Si alguna falla → Error 400/403                       │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Verificar participación (opcional):                   │
│    SELECT * FROM Participaciones                         │
│    WHERE UsuarioId = U3 AND VotacionId = V1             │
│    Si NO existe → Error 403: "No participas en votación" │
│    (Esto es redundante si solo se permite votar          │
│     desde pantalla de votación, pero es defensa profunda)│
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Intenta insertar voto (transacción + constraint):     │
│    BEGIN;                                                 │
│    INSERT INTO Votos {                                   │
│      Id: GUID(),                                          │
│      VotacionId: V1,                                      │
│      UserId: U3,  -- Pedro                                │
│      OpcionId: OP1,  -- Azul                              │
│      CreatedAt: NOW()                                     │
│    };                                                     │
│    COMMIT;                                                │
│                                                           │
│    -- Constraint: UNIQUE(VotacionId, UserId)             │
│    -- Si Pedro ya votó en V1:                            │
│    --   → Violación de constraint                        │
│    --   → Lanza excepción DbUpdateException               │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Captura de exception (race condition handling):       │
│                                                           │
│    catch (DbUpdateException ex) {                         │
│      if (ex.InnerException?.Message                       │
│          .Contains("UNIQUE")) {                           │
│        return Error(409, "Ya votaste en esta votación");  │
│        // RN-02 violation                                │
│      }                                                    │
│      throw; // Re-throw si otro error                    │
│    }                                                      │
│                                                           │
│    -- Esto es MÁS ROBUSTO que SELECT + INSERT            │
│    -- porque evita race condition entre dos requests     │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Si INSERT exitoso:                                    │
│    - Emitir evento SignalR: "VotoEmitido"               │
│      → Administrador ve resultados actualizados en RT    │
│    - Actualizar votosCount denormalizado (opcional)      │
│    - Responder al frontend:                              │
│      {                                                    │
│        success: true,                                    │
│        message: "Tu voto se registró exitosamente",      │
│        data: {                                            │
│          votacionId: "V1",                                │
│          opcionSeleccionada: "Azul"                       │
│        }                                                  │
│      }                                                    │
│    - Frontend redirige a resultados                      │
└──────────────────────────────────────────────────────────┘
```

**Reglas aplicadas**:
- RN-02: Un voto por usuario por votación → UNIQUE constraint.
- RN-04: Solo durante ventana temporal.
- RN-08: Votos inmutables (no hay UPDATE/DELETE endpoints).

---

## 📊 Flujo: Ver Resultados (Autorización Basada en Recursos)

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario Juan (admin de V1) Solicita: GET /votaciones/V1/results
└──────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Backend VERIFICA AUTORIZACIÓN (Resource-Based):          │
│    a) ¿Existe V1? → SELECT * FROM Votaciones WHERE Id=V1   │
│    b) ¿Es Juan administrador?                              │
│       SELECT * FROM Participaciones                        │
│       WHERE UsuarioId = U1 AND VotacionId = V1             │
│                AND Rol = "Administrador"                   │
│    c) Si NO es admin → 403 Forbidden                       │
│    d) Si SÍ es admin → Continuar                           │
└──────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Si es ADMINISTRADOR → Resultados COMPLETOS:              │
│    SELECT                                                   │
│      vo.Id, vo.Texto, vo.Orden,                            │
│      COUNT(v.Id) AS VotosRecibidos,                        │
│      ROUND(COUNT(v.Id) * 100.0 /                           │
│        (SELECT COUNT(*) FROM Votos                         │
│         WHERE VotacionId = V1), 2) AS Porcentaje           │
│    FROM VotacionOpciones vo                                │
│    LEFT JOIN Votos v ON v.OpcionId = vo.Id                │
│    WHERE vo.VotacionId = V1                                │
│    GROUP BY vo.Id                                          │
│    ORDER BY vo.Orden;                                      │
│                                                             │
│    Respuesta: {                                            │
│      votacionId: "V1",                                     │
│      titulo: "¿Qué color prefieres?",                      │
│      opciones: [                                           │
│        { id: "OP1", texto: "Azul", votos: 5, %: 41.67 },  │
│        { id: "OP2", texto: "Rojo", votos: 4, %: 33.33 },  │
│        { id: "OP3", texto: "Verde", votos: 3, %: 25.0 }   │
│      ],                                                     │
│      totalVotos: 12,                                        │
│      estado: "Activa",                                      │
│      miRol: "Administrador"  ← Dashboard disponible         │
│    }                                                        │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Usuario Pedro (votante en V1) Solicita: GET /votaciones/V1/results
└──────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Backend VERIFICA AUTORIZACIÓN:                           │
│    SELECT * FROM Participaciones                           │
│    WHERE UsuarioId = U3 AND VotacionId = V1                │
│    Rol encontrado: "Votante" → Es votante, puede ver resul.│
└──────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Si es VOTANTE → Resultados PARCIALES (agregados):        │
│    (Mismo query que admin, pero:)                          │
│    Respuesta: {                                            │
│      votacionId: "V1",                                     │
│      titulo: "¿Qué color prefieres?",                      │
│      opciones: [                                           │
│        { id: "OP1", texto: "Azul", %: 41.67 },            │
│        { id: "OP2", texto: "Rojo", %: 33.33 },            │
│        { id: "OP3", texto: "Verde", %: 25.0 }             │
│      ],                                                     │
│      totalVotos: 12,                                        │
│      estado: "Activa",                                      │
│      miRol: "Votante",                                      │
│      miVoto: "OP1",  ← Solo ve su propio voto             │
│      dashboard: null  ← NO tiene acceso a dashboard real-time
│    }                                                        │
└──────────────────────────────────────────────────────────────┘
```

**Autorización Resource-Based implementada**:
- `VotacionViewResultsRequirement`: Handler verifica si es admin O votante participante.
- Si es admin: resultados completos + real-time via SignalR.
- Si es votante: resultados agregados (% y total).

---

## 🛢️ Arquitectura de Base de Datos

### Diagrama Relacional

```
┌─────────────────────┐
│      Users          │
├─────────────────────┤
│ Id (PK)             │
│ Email (UNIQUE)      │
│ PasswordHash        │
│ NombreCompleto      │
│ FechaCreacion       │
│ IsActive            │
└────────────┬────────┘
             │
      (1:N)  │
             │
┌────────────▼────────────┐
│  Votaciones             │
├─────────────────────────┤
│ Id (PK)                 │
│ Titulo                  │
│ Descripcion             │
│ CodigoAcceso (UNIQUE)   │
│ FechaInicio             │
│ FechaCierre             │
│ Estado (Enum)           │
│ CreadorId (FK → Users)  │
│ FechaCreacion           │
└─────┬─────────┬─────────┘
      │         │
(1:N) │         │ (1:N)
      │         │
      ▼         ▼
┌──────────────────┐   ┌──────────────────────┐
│ VotacionOpciones │   │  Participaciones     │
├──────────────────┤   ├──────────────────────┤
│ Id (PK)          │   │ Id (PK)              │
│ VotacionId (FK)  │   │ UsuarioId (FK)       │
│ Texto            │   │ VotacionId (FK)      │
│ Orden            │   │ Rol (Enum)           │
└────────┬─────────┘   │ FechaUnion           │
         │             │ UNIQUE(UsuarioId,    │
    (1:N)│             │         VotacionId)  │
         │             └──────────┬───────────┘
         │                        │
         │                        │ (N:1)
         │                        │
         ▼                        ▼
      ┌──────────────────────────────────┐
      │         Votos                     │
      ├──────────────────────────────────┤
      │ Id (PK)                           │
      │ VotacionId (FK)                   │
      │ UserId (FK → Users)               │
      │ OpcionId (FK → VotacionOpciones)  │
      │ CreatedAt                         │
      │ UNIQUE(VotacionId, UserId)        │
      │   ← RN-02: Un voto por usuario    │
      └──────────────────────────────────┘
```

### Índices Clave

```sql
-- Unicidad
INDEX UNIQUE(Users.Email)
INDEX UNIQUE(Votaciones.CodigoAcceso)
INDEX UNIQUE(Participaciones.UsuarioId, Participaciones.VotacionId)
INDEX UNIQUE(Votos.VotacionId, Votos.UserId)  -- RN-02

-- Performance
INDEX(Votaciones.Estado, Votaciones.FechaCierre)  -- Listar activas
INDEX(Votos.VotacionId)  -- Contar votos
INDEX(Participaciones.VotacionId)  -- Listar participantes
INDEX(Participaciones.UsuarioId)  -- Mis votaciones
```

---

## ⚙️ Flujos de Negocio Clave

### Flujo 1: Crear Votación

```
1. Usuario valida campos (Frontend)
2. Backend:
   a) Valida con FluentValidation (RN-03: >=2 opciones, RN-04: fechas válidas)
   b) Genera código único (RN-05) con reintentos
   c) Transacción atómica:
      - INSERT Votaciones
      - INSERT VotacionOpciones (cascade)
      - INSERT Participaciones (rol=Administrador)
      - COMMIT
   d) Emitir evento: "VotacionCreada"
   e) Responder con codigoAcceso
3. Frontend muestra código para compartir
```

### Flujo 2: Unirse por Código

```
1. Usuario ingresa código (Frontend)
2. Backend:
   a) Buscar votación por código
   b) Validar estado != "Finalizada"
   c) Verificar NO duplicado de participación
   d) INSERT Participaciones (rol=Votante)
   e) Emitir evento: "UsuarioUnido"
3. Frontend redirige a votación
```

### Flujo 3: Emitir Voto (RN-02 Anti-Duplicados)

```
1. Usuario selecciona opción (Frontend)
2. Backend:
   a) Validar estado="Activa" y ventana temporal (RN-04)
   b) Validar opción pertenece a votación
   c) Transacción:
      - INSERT Votos (UNIQUE constraint on (VotacionId, UserId))
      - Si constraint violation → catch y retornar "Ya votaste"
   d) Emitir evento SignalR: "VotoRegistrado" → broadcast a participantes
3. Frontend muestra confirmación
```

### Flujo 4: Ver Resultados (Autorización Resource-Based)

```
1. Usuario solicita GET /votaciones/{id}/results
2. Backend:
   a) Cargar Votacion
   b) Verificar Participaciones[usuario, votacion]
   c) Si rol="Administrador":
      - Retornar resultados completos + real-time
      - Activar hub SignalR
   d) Si rol="Votante":
      - Retornar resultados parciales (%)
   e) Si no existe participación → 403 Forbidden
3. Frontend renderiza según rol
```

---

## 🔐 Manejo de Race Conditions

### Problema: Dos votos concurrentes del mismo usuario

```
Request 1: POST /votaciones/V1/vote (Pedro, OP1)   t=0ms
Request 2: POST /votaciones/V1/vote (Pedro, OP2)   t=5ms

Sin protección:
- Ambas pasan el SELECT (no encuentra voto)
- Ambas ejecutan INSERT
- BD crea 2 votos (violación de RN-02) ← MALO

Con UNIQUE constraint + exception handling:
- Request 1: INSERT exitoso
- Request 2: INSERT lanza SqlException (clave duplicada)
  → Catch DbUpdateException
  → Retornar 409 "Ya votaste"
  → CORRECTO
```

### Solución Implementada

```csharp
// Application/Handlers/EmitirVotoCommandHandler.cs
try
{
    var voto = new Voto 
    { 
        VotacionId = votacionId, 
        UserId = currentUserId, 
        OpcionId = opcionId,
        CreatedAt = DateTime.UtcNow
    };
    
    await _unitOfWork.Votos.AddAsync(voto);
    await _unitOfWork.SaveChangesAsync();
    
    // Emitir evento SignalR
    await _hubContext.Clients
        .Group($"votacion_{votacionId}")
        .SendAsync("VotoRegistrado", new { ... });
}
catch (DbUpdateException ex) 
when (ex.InnerException?.Message.Contains("UNIQUE") ?? false)
{
    // RN-02 violation: usuario ya votó
    throw new DomainException("Ya votaste en esta votación");
}
```

### Para CodigoAcceso Único (Reintentos)

```csharp
// Generar código con reintentos
int reintentos = 0;
string codigo;
do
{
    codigo = GenerarCodigoAcceso(); // 6 caracteres
    var existe = await _votacionRepository.CodigoAccesoExistsAsync(codigo);
    reintentos++;
} 
while (existe && reintentos < 10);

if (reintentos >= 10)
    throw new DomainException("No se pudo generar código único");
```

---

## 🔐 Autorización Basada en Recursos

### Concepto: Requirements + Handlers (ASP.NET Core)

```csharp
// Domain/Requirements/VotacionManageRequirement.cs
public class VotacionManageRequirement : IAuthorizationRequirement { }

// Infrastructure/Authorization/VotacionManageHandler.cs
public class VotacionManageHandler : 
    AuthorizationHandler<VotacionManageRequirement, Guid>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        VotacionManageRequirement requirement,
        Guid votacionId)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return;

        var participacion = await _participacionRepository
            .GetAsync(Guid.Parse(userId), votacionId);

        if (participacion?.Rol == "Administrador")
            context.Succeed(requirement);
    }
}

// API/Controllers/VotacionesController.cs
[Authorize(Policy = "VotacionManage")]
public async Task<IActionResult> UpdateVotacion(Guid id, UpdateVotacionRequest request)
{
    // Solo admin puede llegar aquí
    var votacion = await _unitOfWork.Votaciones.GetByIdAsync(id);
    // ... lógica de update
}
```

---

## 📈 Flujo Completo: Caso de Uso End-to-End

### Escenario: Juan crea votación, Pedro se une y vota

```
t=0s:
  Juan (U1) registra en Votapp
  → INSERT Users (U1)
  
t=5s:
  Juan crea votación "¿Azul o Rojo?"
  → INSERT Votaciones (V1, estado=Paused, CreadorId=U1, código=X9Q7KJ)
  → INSERT VotacionOpciones (OP1=Azul, OP2=Rojo)
  → INSERT Participaciones (U1, V1, Rol=Administrador)
  
t=10s:
  Juan activa votación (cambia estado a Activa)
  → UPDATE Votaciones SET Estado='Activa' WHERE Id=V1
  
t=15s:
  Pedro se registra
  → INSERT Users (U2)
  
t=20s:
  Pedro ingresa código X9Q7KJ
  → SELECT Votaciones WHERE CodigoAcceso='X9Q7KJ'
  → INSERT Participaciones (U2, V1, Rol=Votante)
  
t=22s:
  Pedro vota por "Azul"
  → INSERT Votos (V1, U2, OP1)
  → Broadcast SignalR: "VotoRegistrado"
  
t=23s:
  Juan (admin) ve dashboard en tiempo real
  ← Recibe evento SignalR: Azul 1 voto, Rojo 0 votos
  
t=30s:
  Votación termina automáticamente (FechaCierre alcanzada)
  → UPDATE Votaciones SET Estado='Finalizada' WHERE FechaCierre <= NOW()
  
t=31s:
  Pedro intenta votar de nuevo
  → Validación falla: Estado != Activa
  ← Error 400: "La votación ya finalizó"
  
t=32s:
  Juan ve resultados finales
  ← GET /votaciones/V1/results
  ← Respuesta: Azul 1 (100%), Rojo 0 (0%)
```

---

## 🎯 Resumen: Reglas de Negocio Aplicadas por Workflow

| Regla | Descripción | Implementación |
|-------|-------------|-----------------|
| RN-01 | Rol contextual dinámico | Tabla Participaciones(UsuarioId, VotacionId, Rol) |
| RN-02 | Un voto por usuario por votación | UNIQUE(VotacionId, UserId) en Votos + exception handling |
| RN-03 | Votación >=2 opciones | FluentValidation en CreateVotacionValidator |
| RN-04 | Votos solo en ventana temporal | Validación en EmitirVotoHandler |
| RN-05 | Código único por votación | UNIQUE(CodigoAcceso) + reintentos |
| RN-06 | >=2 opciones para activar | Business logic en ActivateVotacionService |
| RN-07 | Solo creador edita si Paused | AuthorizationHandler(Rol==Admin) |
| RN-08 | Votos inmutables | No endpoints UPDATE/DELETE para Votos |
| RN-09 | Estados: Paused, Activa, Finalizada | Enum EstadoVotacion + State Machine |
| RN-10 | Auto-cierre en FechaCierre | Background job o trigger DB |

---

