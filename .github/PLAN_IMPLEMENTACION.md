# 🎯 Votapp - Plan de Acción para Implementación


La versión canónica y actualizada en español se mantiene en `copilot-instructions.md` y en `PLAN_IMPLEMENTACION.md`.

## Resumen Ejecutivo

Se ha **integrado completamente** toda la documentación del proyecto Votapp (Acta de Constitución + Requerimientos) en el archivo central `copilot-instructions.md`. 

**Resultado**: Copilot ahora tendrá contexto completo y podrá:
- ✅ Validar cada implementación contra requerimientos
- ✅ Enforcer reglas de negocio automáticamente
- ✅ Proporcionar guía técnica basada en especificaciones
- ✅ Mapear features a User Stories
- ✅ Asegurar trazabilidad de requisitos

---

## 📈 Lo que Ahora está Disponible

### 1. **Jerarquía Completa de Requerimientos**
```
Carta del Proyecto (Visión)
    ↓
5 Épicas + 5 Casos de Uso
    ↓
16 Historias de Usuario (con criterios SMART)
    ↓
18 Requerimientos Funcionales (RF)
    ↓
11 Requerimientos No-Funcionales (RNF)
    ↓
10 Reglas de Negocio (RN)
```

### 2. **Matriz de Trazabilidad**
Cada Historia de Usuario está mapeada a:
- RF específicos (qué hacer)
- RN que debe cumplir (reglas a validar)
- RNF que aplica (performance, seguridad, etc.)
- Criterios de aceptación (SMART)

### 3. **Guía para Agentes IA**
Copilot ahora conoce:
- ✅ Principios de diseño del proyecto
- ✅ Cómo validar reglas de negocio en código
- ✅ Targets de performance (< 5 seg para votos)
- ✅ Arquitectura Limpia esperada
- ✅ Estándares de calidad de código

---

## 🔧 Cómo Usar en Desarrollo

### Escenario 1: **Implementar Nueva Feature**
```
1. Usuario: "Implementa HU-V01 (Crear Votación)"
2. Copilot: Lee criterios SMART, RF-V01 a RF-V04, RN-03/05/07
3. Copilot: Sugiere validaciones que deben estar en código
4. Copilot: Genera código que cumple todas las RN
5. Resultado: Feature con trazabilidad completa
```

### Escenario 2: **Revisión de Código**
```
1. Usuario: "Revisa este código de emitir voto"
2. Copilot: Valida contra RN-02, RN-04, RN-08
3. Copilot: Verifica RNF-01 (< 5 seg)
4. Copilot: Sugiere optimizaciones
5. Resultado: Código listo para producción
```

### Escenario 3: **Debugging**
```
1. Usuario: "Los usuarios pueden votar dos veces"
2. Copilot: "Eso viola RN-02, revisa emitirVoto()"
3. Copilot: Sugiere validación de duplicados
4. Resultado: Bug fix basado en especificación
```

---

## 📋 Orden Recomendado de Implementación

Basado en **Épicas** e **Historias de Usuario**:

### **Fase 1: Fundación** (Semanas 1-2)
- [ ] HU-U01: Registro de Usuarios
- [ ] HU-U02: Autenticación JWT
- [ ] **Impacto**: E01 - Gestión de Usuarios & Roles

### **Fase 2: Votación Principal** (Semanas 3-5)
- [ ] HU-V01: Crear Votación
- [ ] HU-V02: Configurar Período
- [ ] HU-V05: Gestionar Estados
- [ ] **Impacto**: E02 - Administración de Votaciones

### **Fase 3: Participación** (Semanas 6-8)
- [ ] HU-P01: Unirse por Código
- [ ] HU-P02: Emitir Voto Único
- [ ] **Validar**: RN-02, RN-04, RN-08
- [ ] **Impacto**: E03 - Participación

### **Fase 4: Resultados** (Semanas 9-10)
- [ ] HU-R01: Resultados en Tiempo Real
- [ ] HU-R02: Restringir Acceso
- [ ] **Integrar**: SignalR + Chart.js
- [ ] **Impacto**: E04 - Visualización de Resultados

### **Fase 5: Pulido** (Semanas 11-12)
- [ ] HU-T01: Logging del Sistema
- [ ] HU-T02: Mensajes de Error
- [ ] HU-U03: Editar Perfil
- [ ] HU-U04: Recuperación de Contraseña
- [ ] **Impacto**: E05 - Monitoreo & Soporte

---

## 🛠️ Lista de Verificación Técnica de Implementación

### Backend (ASP.NET Core 9+)
- [ ] Setup Arquitectura Limpia (Domain, Application, Infrastructure, Presentation)
- [ ] **RNF-05** - Implementar capas de Arquitectura Limpia
- [ ] **RNF-06** - Entity Framework Core con MySQL/PostgreSQL
- [ ] **RNF-07** - SignalR para actualizaciones en tiempo real
- [ ] **RNF-02** - Middleware de autenticación JWT
- [ ] **RF-T01** - Infraestructura de Logging (Serilog)
- [ ] **RF-T02** - Manejo global de errores
- [ ] Implementar las 10 Reglas de Negocio (RN-01 a RN-10)

### Frontend (React + Vite)
- [ ] **RNF-03** - UI responsiva con Tailwind
- [ ] **RNF-11** - Estructura modular de componentes
- [ ] **RF-T02** - Mensajes de error con Toast
- [ ] Conectar a API Backend (reemplazar localStorage)
- [ ] **RNF-07** - Integración cliente SignalR
- [ ] **RNF-04** - Testing de compatibilidad de navegadores

### Base de Datos
- [ ] Crear Diagrama E-R
- [ ] Implementar tablas: Usuarios, Votaciones, Votos, VotacionOpciones
- [ ] Agregar restricciones para validación de RN
- [ ] Crear procedimientos almacenados para performance

### Testing
- [ ] **RN-02** - Test unitario: un voto por usuario
- [ ] **RN-04** - Test unitario: validación de ventana de tiempo
- [ ] **RN-05** - Test unitario: códigos de sala únicos
- [ ] **RN-08** - Test unitario: inmutabilidad de votos
- [ ] **RNF-01** - Test de carga: registro de voto < 5s

---

## 📊 Definición de Hecho (DoH)

Para que cada Historia de Usuario sea COMPLETADA:

- [ ] ✅ Código implementado
- [ ] ✅ Todos los criterios SMART cumplidos
- [ ] ✅ Todas las RN asociadas validadas
- [ ] ✅ Todos los RNF cumplidos
- [ ] ✅ Tests unitarios escritos (>80% cobertura)
- [ ] ✅ Tests de integración pasan
- [ ] ✅ Code review aprobado
- [ ] ✅ Documentación actualizada
- [ ] ✅ Benchmarks de performance cumplidos
- [ ] ✅ Revisión de seguridad completada

---

## 🚨 Reglas de Negocio Críticas a Enforcer

### **Prioridad 1 (No se puede saltar)**
- **RN-02** ⚠️ Un voto por usuario por votación → **HU-P02**
- **RN-04** ⚠️ Votos solo durante período → **HU-V02**
- **RN-08** ⚠️ Votos inmutables después de emisión → **HU-P02**

### **Prioridad 2 (Esencial)**
- **RN-05** - Códigos de sala únicos → **HU-V01**
- **RN-07** - Solo creador puede editar/eliminar → **HU-V04**
- **RN-10** - Auto-cierre en fecha final → **HU-V05**

### **Prioridad 3 (Calidad)**
- **RN-01** - Un rol por votación → **HU-U01, HU-U02**
- **RN-03** - Mín 2 opciones → **HU-V01**
- **RN-06** - Requiere 2+ opciones para activar → **HU-V02**
- **RN-09** - Transiciones de estado válidas → **HU-V05**

---

## 📈 Métricas de Éxito (de la Carta del Proyecto)

| Métrica | Target | Validación |
|---------|--------|-----------|
| Cero errores de voto | 0 duplicados | Enforcement RN-02 |
| Registro de voto | < 5 segundos | Test de performance RNF-01 |
| Disponibilidad de resultados | 95%+ uptime | Monitoreo SignalR |
| Satisfacción del usuario | 90% "fácil de usar" | Testing de usuario |
| Completitud de módulos | 5/5 módulos | Matriz de trazabilidad |
| Documentación | 100% completa | Revisión de documentación |
| Actualizaciones en tiempo real | Live en panel admin | Test de integración SignalR |

---

## 🔐 Consideraciones de Seguridad

### Autenticación (RF-U02, RNF-02)
- Tokens JWT con expiración definida
- Almacenamiento seguro de contraseñas (hashing + salt)
- Mecanismo de refresh de token

### Autorización (RF-U03, RN-01, RN-07)
- Control de acceso basado en roles (RBAC)
- Verificar que usuario es propietario antes de modificaciones
- Enforcer endpoints solo admin

### Validación de Datos (RN-02, RN-04, RN-08)
- Validar todos los inputs en servidor
- Prevenir duplicación de votos (unique constraint BD)
- Enforcer reglas de negocio en capa de persistencia

### Logging (RF-T01, RNF-10)
- Log todas las emisiones de voto
- Log todos los cambios de estado
- Log acceso a resultados por rol

---

## 📞 Soporte & Referencias

### Recursos Clave
- 📄 **Especificación**: `copilot-instructions.md` (secciones 1-6)
- 📊 **Carta**: Sección 1 - Visión del proyecto
- 📋 **Requerimientos**: Sección 2 - Todos los RF/RNF/RN
- 🎭 **Casos de Uso**: Sección 4 - Flujos detallados
- 👥 **Historias de Usuario**: Sección 5 - Guía de implementación
- 🔗 **Trazabilidad**: Sección 6 - Mapeo de features

### Para Asistencia de Copilot
Pregunta por:
- `"¿Qué RN debo enforcer para HU-V01?"`
- `"Genera código de validación para RN-02"`
- `"¿Cuáles son los criterios de aceptación para HU-P02?"`
- `"Lista todos los RF que aplican al módulo de Resultados"`
- `"¿Cómo implemento SignalR para RNF-07?"`

---

## ✅ Lista de Verificación de Estado

- [x] ✅ Charter integrada en copilot-instructions.md
- [x] ✅ Todos los RF/RN/RNF documentados
- [x] ✅ 5 Épicas definidas
- [x] ✅ 5 Casos de Uso detallados
- [x] ✅ 16 Historias de Usuario con criterios SMART
- [x] ✅ Matriz de trazabilidad completa
- [x] ✅ Guía de Agentes IA actualizada
- [ ] ⏳ Implementación de Backend (Sprint 3)
- [ ] ⏳ Integración de Frontend (Sprint 4)
- [ ] ⏳ Testing & Validación (Sprint 5)
- [ ] ⏳ Deployment a Producción

---

## 🎯 Próximas Acciones

### Para Product Owner
1. ✅ Revisar las 16 Historias de Usuario
2. ✅ Validar criterios de aceptación
3. ✅ Priorizar orden de implementación
4. ⏳ Programar sprint planning

### Para Equipo de Desarrollo
1. ✅ Leer documentación completa (este archivo + copilot-instructions.md)
2. ✅ Entender Reglas de Negocio (RN-01 a RN-10)
3. ✅ Revisar requerimientos de Arquitectura (RNF-05, RNF-08)
4. ⏳ Setup ambiente de desarrollo
5. ⏳ Comenzar Sprint 1 (usuarios & autenticación)

### Para Copilot (Agente IA)
1. ✅ Proporcionar sugerencias contextuales durante coding
2. ✅ Validar código contra RN durante implementación
3. ✅ Sugerir optimizaciones basadas en RNF
4. ✅ Generar tests unitarios para cada HU
5. ✅ Asegurar trazabilidad en commits

---

**Versión del Documento**: 1.0  
**Fecha**: 14 de noviembre de 2025  
**Estado**: 🟢 LISTO PARA IMPLEMENTACIÓN  
**Equipo**: Figueroa Lucas, Corbalan Mario

*Esta documentación es la guía oficial del proyecto Votapp MVP 1. Debe ser consultada en cada decisión técnica y de implementación.*
