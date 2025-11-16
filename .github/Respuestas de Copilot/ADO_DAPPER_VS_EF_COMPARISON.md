# 🔍 COMPARACIÓN: ADO.NET vs Dapper vs Entity Framework - ¿Cuál es más portable?

**Tu pregunta**: ¿ADO.NET o Dapper generan menos acoplamiento que EF al Domain?

**Respuesta**: Sí, PERO tienen otros trade-offs que los hacen menos ideales para MVP.

---

## 📊 COMPARACIÓN COMPLETA

### **1. ADO.NET (Raw SQL)**

#### Estructura
```csharp
// Domain Layer - 100% PURO (sin dependencias)
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    // SIN NADA de acceso a datos
}

// Infrastructure Layer - AQUÍ va toda la lógica de BD
public class UserRepository : IUserRepository
{
    private readonly string _connectionString;
    
    public async Task<User?> GetByIdAsync(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            using (var command = new SqlCommand("SELECT * FROM Users WHERE Id = @id", connection))
            {
                command.Parameters.AddWithValue("@id", id);
                await connection.OpenAsync();
                
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new User
                        {
                            Id = (int)reader["Id"],
                            Email = (string)reader["Email"],
                            PasswordHash = (string)reader["PasswordHash"]
                        };
                    }
                }
            }
        }
        return null;
    }
}
```

#### Análisis
| Aspecto | Valoración |
|--------|-----------|
| **Independencia Domain** | ✅✅✅ 100% puro |
| **Acoplamiento BD** | ✅ Mínimo |
| **Portabilidad** | ✅✅✅ Máxima (cambiar BD es "trivial") |
| **Facilidad de uso** | ❌ Muy tedioso |
| **SQL Injection** | ⚠️ Riesgo si no usas parameters |
| **Mapeo de resultados** | ❌ Manual, repetitivo |
| **Relaciones** | ❌ Difícil (N+1 queries) |
| **Performance** | ✅✅✅ Excelente (control total) |
| **Tiempo desarrollo** | ❌ Lento (escribir SQL manualmente) |

#### Ventajas
- ✅ Domain 100% independiente
- ✅ Máxima portabilidad (cambiar de MySQL a PostgreSQL = cambiar connection string)
- ✅ Control total del SQL
- ✅ Performance predecible
- ✅ Sin "magia" de ORM

#### Desventajas
- ❌ Escribir SQL manualmente = tedioso
- ❌ Mapeo manual de resultados = repetitivo
- ❌ Difícil manejar relaciones complejas
- ❌ Cambiar esquema = cambiar código SQL
- ❌ Propenso a errores
- ❌ Para MVP: **TOMA DEMASIADO TIEMPO** (6-8 horas solo en CRUD básico)

**¿Para MVP?**: ❌ NO (demasiado tedioso)

---

### **2. Dapper (Micro-ORM)**

#### Estructura
```csharp
// Domain Layer - 100% PURO
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}

// Infrastructure Layer
public class UserRepository : IUserRepository
{
    private readonly string _connectionString;
    
    public async Task<User?> GetByIdAsync(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            return await connection.QuerySingleOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Id = @id",
                new { id }
            );
        }
    }
    
    public async Task<User?> GetByEmailAsync(string email)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            return await connection.QuerySingleOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Email = @email",
                new { email }
            );
        }
    }
}
```

#### Análisis
| Aspecto | Valoración |
|--------|-----------|
| **Independencia Domain** | ✅✅✅ 100% puro |
| **Acoplamiento BD** | ✅ Mínimo |
| **Portabilidad** | ✅✅✅ Alta (cambiar BD = cambiar SQL strings) |
| **Facilidad de uso** | ✅✅ Fácil (menos boilerplate que ADO.NET) |
| **SQL Injection** | ✅ Seguro (parameters automáticos) |
| **Mapeo de resultados** | ✅✅ Automático (convención de nombres) |
| **Relaciones** | ⚠️ Manual (no hay lazy loading) |
| **Performance** | ✅✅✅ Excelente |
| **Tiempo desarrollo** | ✅✅ Medio (escribir SQL, pero menos boilerplate) |

#### Ventajas
- ✅ Domain 100% independiente
- ✅ SQL explícito (controlas exactamente qué hace)
- ✅ Mejor que ADO.NET (menos código)
- ✅ Mapeo automático
- ✅ Performance excelente
- ✅ Portable (cambiar BD = cambiar SQL)
- ✅ Sin "magia" confusa

#### Desventajas
- ❌ Escribir SQL manualmente (menos que ADO.NET, pero más que EF)
- ❌ Cambiar esquema = actualizar queries
- ❌ Relaciones no automáticas (debes hacer joins explícitos)
- ❌ Para MVP: **SIGUE SIENDO TEDIOSO** (4-5 horas en CRUD)
- ❌ Menos conveniencia que EF

**¿Para MVP?**: ⚠️ Posible, pero más lento que EF

---

### **3. Entity Framework Core (Full ORM)**

#### Estructura
```csharp
// Domain Layer - CON navegaciones (acoplamiento débil)
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    
    // Navegaciones - necesarias para EF
    public virtual ICollection<Votacion> VotacionesCreadas { get; set; } = new();
    public virtual ICollection<Voto> VotosEmitidos { get; set; } = new();
}

// Infrastructure Layer
public class UserRepository : IUserRepository
{
    private readonly VotappDbContext _context;
    
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }
    
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}
```

#### Análisis
| Aspecto | Valoración |
|--------|-----------|
| **Independencia Domain** | ⚠️ 80% (navegaciones vinculan a EF) |
| **Acoplamiento BD** | ⚠️ Medio (implícito) |
| **Portabilidad** | ⚠️⚠️ Media (EF genera SQL, pero difícil cambiar de BD) |
| **Facilidad de uso** | ✅✅✅ Excelente (casi no escribes SQL) |
| **SQL Injection** | ✅✅✅ Seguro (parameterizado automático) |
| **Mapeo de resultados** | ✅✅✅ Automático (shadow properties, tracking) |
| **Relaciones** | ✅✅✅ Automáticas (lazy loading, includes) |
| **Performance** | ✅✅ Bueno (puede optimizar con selectos) |
| **Tiempo desarrollo** | ✅✅✅ Rápido (menos código, convenciones) |

#### Ventajas
- ✅ Desarrollo rápido (ideal MVP)
- ✅ Relaciones automáticas
- ✅ Lazy loading / Include
- ✅ SQL generado automáticamente
- ✅ Cambiar de MySQL a PostgreSQL = cambiar provider
- ✅ DbContext centralizado
- ✅ Migrations automáticas

#### Desventajas
- ❌ Acoplamiento débil a EF (navegaciones en Domain)
- ❌ Difícil hacer queries complejas
- ❌ Overhead de tracking
- ❌ Si cambias a Dapper/ADO.NET = refactorizar bastante

**¿Para MVP?**: ✅ SÍ (mejor opción)

---

## 🎯 TABLA COMPARATIVA FINAL

| Criterio | ADO.NET | Dapper | EF Core |
|----------|---------|--------|---------|
| **Independencia Domain** | ✅✅✅ 100% | ✅✅✅ 100% | ⚠️ 80% |
| **Acoplamiento** | ✅ Mínimo | ✅ Mínimo | ⚠️ Medio |
| **Portabilidad BD** | ✅✅✅ Máxima | ✅✅✅ Alta | ⚠️ Media |
| **Facilidad uso** | ❌ Difícil | ✅✅ Fácil | ✅✅✅ Muy fácil |
| **Relaciones** | ❌ Manual | ⚠️ Manual | ✅✅✅ Automático |
| **Performance** | ✅✅✅ Excelente | ✅✅✅ Excelente | ✅✅ Bueno |
| **Tiempo MVP** | ❌ 6-8 horas | ⚠️ 4-5 horas | ✅✅✅ 1-2 horas |
| **Cambios esquema** | ⚠️ Tedioso | ⚠️ Tedioso | ✅ Fácil (migrations) |
| **Curva aprendizaje** | ❌ Alta | ✅ Media | ✅✅ Baja |

---

## 🏗️ ARQUITECTURA EN CADA OPCIÓN

### ADO.NET
```
Domain Layer (100% puro)
    ↓
Application Layer (servicios)
    ↓
Infrastructure Layer (SQL manual + mapeo manual)
    ↓
Base de Datos
```
**Portabilidad**: ✅✅✅ Perfecta (cambiar BD = trivial)

---

### Dapper
```
Domain Layer (100% puro)
    ↓
Application Layer (servicios)
    ↓
Infrastructure Layer (SQL explícito + mapeo automático)
    ↓
Base de Datos
```
**Portabilidad**: ✅✅✅ Muy buena (cambiar BD = actualizar queries)

---

### Entity Framework
```
Domain Layer (80% puro - con navegaciones)
    ↓
Application Layer (servicios)
    ↓
Infrastructure Layer (DbContext + repositories)
    ↓
Base de Datos
```
**Portabilidad**: ⚠️⚠️ Media (EF abstrae BD, pero cambiar ORM = mucho trabajo)

---

## 🤔 ¿CUÁL ELEGIR PARA VOTAPP?

### Escenario 1: MVP (12 semanas) con deadline ajustado
**→ EF Core** ✅

**Por qué**:
- Necesitas terminar rápido
- Las 2 horas que ahorras ×4 tareas = 8 horas ganadas
- Domain "casi puro" es acceptable para MVP
- Relaciones automáticas simplifican lógica

---

### Escenario 2: Máxima portabilidad + purismo
**→ Dapper** ✅

**Por qué**:
- Domain 100% independiente
- SQL explícito (sabes exactamente qué hace)
- Fácil cambiar a ADO.NET o raw SQL después
- Mejor que EF si cambias de BD

---

### Escenario 3: Máxima independencia + control total
**→ ADO.NET** ✅

**Por qué**:
- Domain totalmente agnóstico
- Control absoluto del SQL
- Máximo conocimiento de performance

**En contra**: Toma mucho tiempo

---

## 💡 REFLEXIÓN: ¿IMPORTA LA PORTABILIDAD REALMENTE?

### Pregúntate:
1. **¿Votapp REALMENTE va a cambiar de MySQL?**
   - En MVP: NO
   - En producción: PROBABLEMENTE NO (MySQL es estable, scalable)
   - Razón: cambiar de BD = cambiar toda la estrategia

2. **¿Qué es más importante: términos o funcionalidad?**
   - MVP: **Funcionalidad** (entregar a tiempo)
   - Producción: **Ambas** (balance)

3. **Si escalas: ¿cambiarías de ORM?**
   - ADO.NET → Dapper = Refactoring pequeño (re-escribir queries)
   - Dapper → ADO.NET = Refactoring pequeño
   - EF → Dapper = Refactoring medio (remover navegaciones)
   - EF → ADO.NET = Refactoring grande (rewrite total)

---

## 🎯 MI RECOMENDACIÓN FINAL PARA VOTAPP

### **OPCIÓN RECOMENDADA: EF Core + Planes de Migración**

**Por qué**:
1. ✅ Terminas MVP en tiempo
2. ✅ Domain 80% puro (aceptable)
3. ✅ Relaciones automáticas (simplifica)
4. ✅ Si luego quieres Dapper = refactoring 20%

**Cómo mitigar el acoplamiento**:
```csharp
// 1. Usar interfaces para todo
public interface IVotappDbContext
{
    DbSet<User> Users { get; }
    DbSet<Votacion> Votaciones { get; }
    Task<int> SaveChangesAsync();
}

// 2. Inyectar IVotappDbContext, no VotappDbContext directo
// 3. Documentar: "Si cambias a Dapper, implementa IVotappDbContext"

// 4. En el futuro, puedes hacer:
public class DapperVotappContext : IVotappDbContext
{
    // Implementar con Dapper sin cambiar el resto del código
}
```

---

### **ALTERNATIVA SI PREFIERES PURISMO: Dapper**

**Por qué**:
- ✅ Domain 100% independiente
- ✅ SQL explícito
- ✅ Fácil migrar a ADO.NET después

**En contra**:
- ❌ 4-5 horas en setup (vs 1-2 con EF)
- ❌ Escribir SQL manualmente
- ❌ Menos conveniencia

---

## 📋 DECISIÓN FINAL

**Para Votapp MVP recomiendo**:

### ✅ EF Core (Pragmático)
- Terminas a tiempo
- Domain 80% puro (buena razón: `ICollection<>` es BCL, no EF-specific)
- Si necesitas cambiar: refactoring es viable

### ⚠️ Dapper (Si quieres purismo)
- Domain 100% puro
- Más tedioso ahora
- Más fácil cambiar después

### ❌ ADO.NET (No recomendado para MVP)
- Demasiado tedioso
- Para 12 semanas: overkill
- Mejor después si necesitas máximo control

---

## 🚀 PRÓXIMO PASO

**¿Qué prefieres?**

**A)** EF Core (Mi recomendación)
- Rápido, pragmático, Domain casi puro

**B)** Dapper (Si prefieres purismo)
- 100% puro, pero más trabajo ahora

**C)** ADO.NET (Si quieres máximo control)
- Perfecto puro, pero muy tedioso

Decide y seguimos con **FASE 0**. 👉

