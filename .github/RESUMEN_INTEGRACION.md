# 📚 Votapp Instrucciones Copilot - Resumen de Integración

## ✅ Lo que fue Integrado

El archivo `copilot-instructions.md` ha sido **completamente actualizado** con toda la documentación del proyecto Votapp, estructurada en **6 secciones principales**:

---

## 📋 Visión General de la Estructura

### 1️⃣ **Acta de Constitución del Proyecto**
- **Justificación** - Por qué existe Votapp
- **Objetivo General** - Visión del proyecto
- **Objetivos Específicos (SMART)** - 6 objetivos medibles
- **Alcance y Limitaciones** - Qué incluye y qué no
- **Supuestos y Restricciones** - Contexto de operación
- **Entregables** - Qué se entregará
- **Criterios de Éxito** - Métricas de validación
- **Cronograma** - Plan de 5 sprints

---

### 2️⃣ **Requerimientos & Reglas del Dominio**
- **4 Actores**: Administrador, Votante, Sistema, Desarrollador
- **RF (Requerimientos Funcionales)**: 18 requisitos organizados por módulo
  - RF-U: Usuarios (5)
  - RF-V: Votaciones (6)
  - RF-P: Participación (4)
  - RF-R: Resultados (4)
  - RF-T: Técnicos (3)
- **RNF (Requerimientos No-Funcionales)**: 11 requisitos técnicos
- **RN (Reglas de Negocio)**: 10 reglas del dominio

---

### 3️⃣ **Épicas** (5 Épicas Principales)
| Épica | Objetivo |
|-------|----------|
| **E01** | Gestión de usuarios y roles |
| **E02** | Administración de votaciones |
| **E03** | Participación en votaciones |
| **E04** | Visualización de resultados |
| **E05** | Monitoreo y soporte técnico |

---

### 4️⃣ **Casos de Uso** (5 Casos de Uso Principales)
- **CU01** – Gestionar usuarios y roles
- **CU02** – Administrar votaciones
- **CU03** – Participar en votaciones
- **CU04** – Visualizar resultados
- **CU05** – Monitorear sistema

Cada caso de uso incluye:
- Épica asociada
- Actores involucrados
- Reglas de negocio relacionadas
- Flujo principal y alternos
- Precondiciones y postcondiciones

---

### 5️⃣ **Historias de Usuario** (16 Historias de Usuario)

#### **Módulo de Usuarios (E01)** - 4 HU
- HU-U01: Registro de usuario
- HU-U02: Autenticación segura
- HU-U03: Editar perfil básico
- HU-U04: Recuperar contraseña

#### **Módulo de Votaciones (E02)** - 5 HU
- HU-V01: Crear votación
- HU-V02: Configurar período de votación
- HU-V03: Editar votación pausada
- HU-V04: Eliminar votación
- HU-V05: Gestionar estados

#### **Módulo de Participación (E03)** - 2 HU
- HU-P01: Ingreso mediante código
- HU-P02: Emitir voto único

#### **Módulo de Resultados (E04)** - 2 HU
- HU-R01: Visualizar resultados en tiempo real
- HU-R02: Restringir acceso a resultados

#### **Monitoreo & Soporte (E05)** - 2 HU
- HU-T01: Registrar logs del sistema
- HU-T02: Mostrar mensajes claros de error

**Cada Historia de Usuario incluye:**
- ✅ Formato estándar (Como... Quiero... Para que...)
- ✅ Criterios de Aceptación (SMART)
- ✅ Estimación en puntos
- ✅ Prioridad (Alta/Media/Baja)
- ✅ Trazabilidad (RF, RN, RNF asociados)
- ✅ Cumplimiento de principios INVEST

---

### 6️⃣ **Matriz de Trazabilidad**
Mapeo completo bidireccional:
```
HU ↔ RF ↔ RN ↔ Epic ↔ CU
```

| Épica | Casos de Uso | Historias de Usuario |
|-------|--------------|----------------------|
| E01 | CU01 | HU-U01 a HU-U04 |
| E02 | CU02 | HU-V01 a HU-V05 |
| E03 | CU03 | HU-P01 a HU-P02 |
| E04 | CU04 | HU-R01 a HU-R02 |
| E05 | CU05 | HU-T01 a HU-T02 |

---

## 🎯 Guía Mejorada para Agentes IA

### Principios de Diseño
1. **Enfoque centrado en estado** - Trazar data flow antes de implementar
2. **Driven por Requerimientos** - Validar RF/RN/RNF antes de codear
3. **Sin romper claves** - Mantener compatibilidad localStorage
4. **Responsive por defecto** - Mobile-first en Tailwind
5. **Validación en vistas** - Forms validan antes de API calls
6. **Manejo de errores claro** - Usar Toast system con mensajes descriptivos

### Enforcement de Reglas de Negocio
El código debe validar automáticamente:
- ✅ **RN-02**: Un voto por usuario por votación
- ✅ **RN-04**: Votos solo durante período configurado
- ✅ **RN-05**: Códigos de acceso únicos
- ✅ **RN-07**: Solo creador puede editar votaciones pausadas
- ✅ **RN-08**: Votos inmutables después de emisión
- ✅ **RN-10**: Auto-cierre en fecha de término

### Targets de Performance (RNF-01)
- 🎯 Registro de voto: < 5 segundos
- 🎯 Actualización de resultados: tiempo real (SignalR)
- 🎯 95%+ disponibilidad en pruebas

---

## 📊 Estadísticas de Documentación

| Métrica | Cantidad |
|---------|----------|
| **Líneas totales** | 698 |
| **Requerimientos Funcionales** | 18 |
| **Requerimientos No-Funcionales** | 11 |
| **Reglas de Negocio** | 10 |
| **Épicas** | 5 |
| **Casos de Uso** | 5 |
| **Historias de Usuario** | 16 |
| **Actores** | 4 |

---

## 💡 Cómo Usar Esta Documentación

### Para **Implementación de Features**
1. Identifica la HU relacionada (ej: HU-V01)
2. Lee los "Criterios de Aceptación" (SMART)
3. Revisa RF y RN asociados
4. Valida contra los "AI Agent Guidelines"
5. Implementa y verifica cada RN

### Para **Validación & Testing**
1. Usa la Matriz de Trazabilidad
2. Verifica que cada RF sea testeable
3. Valida cada RN con test cases
4. Revisa RNF (performance, seguridad, usabilidad)

### Para **Decisiones de Arquitectura**
1. Lee la sección "Acta de Constitución"
2. Referencia "Alcance" para límites
3. Consulta "Requerimientos Técnicos No-Funcionales"
4. Alinea con Arquitectura Limpia (RNF-05, RNF-08)

---

## 🔗 Ubicación del Archivo

**Ubicación**: `c:\Users\franc\Proyecto Votapp\.github\copilot-instructions.md`

**Acceso permanente**: Este archivo se carga automáticamente en cada sesión del Copilot, proporcionando:
- ✅ Contexto completo del proyecto
- ✅ Especificaciones técnicas detalladas
- ✅ Matriz de trazabilidad
- ✅ Guías de implementación

---

## 🚀 Próximos Pasos

**Para el equipo de desarrollo:**
1. ✅ Revisar acta y requerimientos
2. ✅ Validar que las HU reflejen la visión del proyecto
3. ✅ Implementar backend (ASP.NET Core + SignalR)
4. ✅ Crear pruebas unitarias para cada RN
5. ✅ Integrar API con frontend React

**Para el Agente IA (Copilot):**
1. ✅ Referencia automática a RF/RN/HU durante development
2. ✅ Validación de reglas de negocio en cada commit
3. ✅ Sugerencias de optimización basadas en RNF
4. ✅ Asistencia en troubleshooting con contexto completo

---

## ✨ Beneficios

| Beneficio | Impacto |
|-----------|--------|
| **Contexto Centralizado** | Una única fuente de verdad |
| **Trazabilidad Completa** | HU → RF → RN → Código |
| **Decisiones Informadas** | Basadas en requerimientos reales |
| **Validación Automática** | Enforcement de RN en desarrollo |
| **Escalabilidad** | Arquitectura clara y modular |
| **Mantenibilidad** | Documentación siempre sincronizada |

---

**Documento generado**: 14 de noviembre de 2025  
**Versión**: Votapp MVP 1  
**Estado**: ✅ Completamente Integrado
