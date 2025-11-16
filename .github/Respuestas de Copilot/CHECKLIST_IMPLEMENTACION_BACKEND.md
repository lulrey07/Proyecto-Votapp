# ✅ CHECKLIST DE IMPLEMENTACIÓN BACKEND - Votapp MVP

**Objetivo**: Guía paso a paso para que TÚ construyas el backend con recomendaciones de cómo hacerlo.

**Tech Stack**: .NET 9 Web API + MySQL + Clean Architecture

---

## 📚 Terminología Importante

### ¿Qué significa "Scaffold"?

**Scaffold** = Crear la estructura base/esqueleto de un proyecto.

Es como el "andamiaje" de una construcción: proporciona la base inicial sobre la que trabajas.

**Ejemplos en .NET:**
- `dotnet new webapi` → Scaffolding de un proyecto Web API base
- Entity Framework Migrations → Scaffolding de tablas en BD
- Entity Framework Reverse Engineering → Scaffolding de modelos desde BD existente

**En tu caso**: "No quiero que crees scaffold aún" = "No quiero que generes la estructura base aún, solo enséñame cómo la harías."

---

## 🎯 CHECKLIST - Fases de Implementación

### FASE 0: PREPARACIÓN (Hoy o Mañana)

#### Tarea 0.1: Crear Proyecto Base .NET 9
**Descripción**: Crear la estructura inicial de un Web API en .NET 9

**Comandos a ejecutar** (en PowerShell):
```powershell
# 1. Navegar a la carpeta Backend.Votapp
cd c:\Users\franc\Proyecto Votapp\Backend.Votapp

# 2. Crear proyecto Web API
dotnet new webapi -n Votapp.API -f net9.0

# 3. Crear soluciones para cada capa (Domain, Application, Infrastructure, Presentation)
dotnet new classlib -n Votapp.Domain -f net9.0
dotnet new classlib -n Votapp.Application -f net9.0
dotnet new classlib -n Votapp.Infrastructure -f net9.0

# 4. Crear archivo de solución
dotnet new sln -n Votapp

# 5. Agregar proyectos a la solución
dotnet sln Votapp.sln add Votapp.API/Votapp.API.csproj
dotnet sln Votapp.sln add Votapp.Domain/Votapp.Domain.csproj
dotnet sln Votapp.sln add Votapp.Application/Votapp.Application.csproj
dotnet sln Votapp.sln add Votapp.Infrastructure/Votapp.Infrastructure.csproj
```

**Resultado esperado**:
```
Backend.Votapp/
├── Votapp.sln
├── Votapp.API/
├── Votapp.Domain/
├── Votapp.Application/
└── Votapp.Infrastructure/
```

**Criterio de Aceptación** ✅:
- [ ] Puedes abrir `Votapp.sln` en Visual Studio
- [ ] Todos los 4 proyectos compilan sin errores
- [ ] La estructura de carpetas coincide con Clean Architecture

---

#### Tarea 0.2: Establecer Referencias entre Proyectos
**Descripción**: Agregar referencias de proyecto siguiendo Clean Architecture

**Estructura de dependencias recomendada**:
- `Votapp.Domain` → No depende de nada (más bajo nivel)
- `Votapp.Application` → Depende de `Votapp.Domain`
- `Votapp.Infrastructure` → Depende de `Votapp.Domain`
- `Votapp.API` → Depende de `Votapp.Application` e `Votapp.Infrastructure`

**Comandos PowerShell a ejecutar** (desde la raíz `Backend.Votapp`):

```powershell
# (1) Application -> Domain
dotnet add src\Votapp.Application\Votapp.Application.csproj reference src\Votapp.Domain\Votapp.Domain.csproj

# (2) Infrastructure -> Domain
dotnet add src\Votapp.Infrastructure\Votapp.Infrastructure.csproj reference src\Votapp.Domain\Votapp.Domain.csproj

# (3) API -> Application
dotnet add src\Votapp.API\Votapp.API.csproj reference src\Votapp.Application\Votapp.Application.csproj

# (4) API -> Infrastructure
dotnet add src\Votapp.API\Votapp.API.csproj reference src\Votapp.Infrastructure\Votapp.Infrastructure.csproj

# Verificación: listar referencias del proyecto API
dotnet list src\Votapp.API\Votapp.API.csproj reference

# Compilar solución completa
dotnet build Backend.Votapp.sln
```

**Criterio de Aceptación** ✅:
- [ ] Los 4 comandos de referencia se ejecutan sin errores
- [ ] `dotnet list` muestra las dos referencias en API
- [ ] `dotnet build` compila exitosamente sin errores de referencia

**Nota sobre arquitectura**:
- Domain define contratos (interfaces).
- Infrastructure implementa esos contratos usando EF Core.
- Application usa las interfaces de Domain (no conoce implementaciones concretas).
- API registra implementaciones en DI y orquesta llamadas.
- Esto evita acoplamiento circular y facilita testing.

---

#### Tarea 0.3: Instalar NuGet Packages Necesarios
**Descripción**: Agregar las librerías que necesitarás

**Packages a instalar** (en Package Manager Console o CLI):

```powershell
# En Votapp.Domain
dotnet add Votapp.Domain/Votapp.Domain.csproj package FluentValidation

# En Votapp.Application
dotnet add Votapp.Application/Votapp.Application.csproj package MediatR
dotnet add Votapp.Application/Votapp.Application.csproj package AutoMapper
dotnet add Votapp.Application/Votapp.Application.csproj package FluentValidation

# En Votapp.Infrastructure
dotnet add Votapp.Infrastructure/Votapp.Infrastructure.csproj package Microsoft.EntityFrameworkCore
dotnet add Votapp.Infrastructure/Votapp.Infrastructure.csproj package Pomelo.EntityFrameworkCore.MySql
dotnet add Votapp.Infrastructure/Votapp.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Tools

# En Votapp.API
dotnet add Votapp.API/Votapp.API.csproj package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add Votapp.API/Votapp.API.csproj package Serilog
dotnet add Votapp.API/Votapp.API.csproj package Serilog.AspNetCore
```

**Criterio de Aceptación** ✅:
- [ ] Todos los packages se instalan sin conflictos
- [ ] `dotnet build` compila exitosamente
- [ ] No hay warnings críticos

---

### FASE 1: DOMAIN LAYER (Entidades y Reglas)

#### Tarea 1.1: Crear Entidades POCO (Domain/Entities)
**Descripción**: Definir las clases de dominio (User, Votacion, Voto, VotacionOpcion)

**Estructura que necesitas**:
```
Votapp.Domain/
├── Entities/
│   ├── User.cs
│   ├── Votacion.cs
│   ├── Voto.cs
│   └── VotacionOpcion.cs
├── Enums/
│   ├── EstadoVotacion.cs
│   └── RoleUsuario.cs
└── ValueObjects/
    └── CodigoAcceso.cs
```

**Ejemplo 1 - `User.cs`**:
```csharp
// Votapp.Domain/Entities/User.cs
namespace Votapp.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public bool Activo { get; set; } = true;

        // Relaciones
        public ICollection<Votacion> VotacionesCreadas { get; set; } = new List<Votacion>();
        public ICollection<Voto> VotosEmitidos { get; set; } = new List<Voto>();
    }
}
```

**Ejemplo 2 - `Votacion.cs`**:
```csharp
// Votapp.Domain/Entities/Votacion.cs
using Votapp.Domain.Enums;

namespace Votapp.Domain.Entities
{
    public class Votacion
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public EstadoVotacion Estado { get; set; } = EstadoVotacion.Paused;
        public string CodigoAcceso { get; set; } = string.Empty; // Código único (6 caracteres)
        public int CreadorId { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Relaciones
        public User? Creador { get; set; }
        public ICollection<VotacionOpcion> Opciones { get; set; } = new List<VotacionOpcion>();
        public ICollection<Voto> Votos { get; set; } = new List<Voto>();
    }
}
```

**Ejemplo 3 - `Voto.cs`**:
```csharp
// Votapp.Domain/Entities/Voto.cs
namespace Votapp.Domain.Entities
{
    public class Voto
    {
        public int Id { get; set; }
        public int VotacionId { get; set; }
        public int UsuarioId { get; set; }
        public int OpcionSeleccionadaId { get; set; } // ID de VotacionOpcion
        public DateTime FechaEmision { get; set; }

        // Relaciones
        public Votacion? Votacion { get; set; }
        public User? Usuario { get; set; }
        public VotacionOpcion? OpcionSeleccionada { get; set; }
    }
}
```

**Ejemplo 4 - `VotacionOpcion.cs`**:
```csharp
// Votapp.Domain/Entities/VotacionOpcion.cs
namespace Votapp.Domain.Entities
{
    public class VotacionOpcion
    {
        public int Id { get; set; }
        public int VotacionId { get; set; }
        public string Texto { get; set; } = string.Empty;
        public int Orden { get; set; } // Orden de aparición

        // Relaciones
        public Votacion? Votacion { get; set; }
        public ICollection<Voto> VotosRecibidos { get; set; } = new List<Voto>();
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Las 4 entidades se crean sin errores
- [ ] Tienen navegación bidireccional (relaciones)
- [ ] Compilación exitosa

---

#### Tarea 1.2: Crear Enums (Domain/Enums)
**Descripción**: Definir los tipos de estados y roles

**Ejemplo 1 - `EstadoVotacion.cs`**:
```csharp
// Votapp.Domain/Enums/EstadoVotacion.cs
namespace Votapp.Domain.Enums
{
    public enum EstadoVotacion
    {
        Paused = 0,      // Estado inicial, permite edición
        Activa = 1,      // Período de votación abierto
        Finalizada = 2   // Votación cerrada, no acepta más votos
    }
}
```

**Ejemplo 2 - `RoleUsuario.cs`**:
```csharp
// Votapp.Domain/Enums/RoleUsuario.cs
namespace Votapp.Domain.Enums
{
    public enum RoleUsuario
    {
        Administrator = 0,  // Crea y gestiona votaciones
        Voter = 1          // Solo participa en votaciones
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Enums creados y compilados
- [ ] Valores numéricos correctos (para BD)

---

#### Tarea 1.3: Crear Value Objects (Domain/ValueObjects) - OPCIONAL PARA MVP
**Descripción**: Objetos simples reutilizables (CodigoAcceso)

**Ejemplo**:
```csharp
// Votapp.Domain/ValueObjects/CodigoAcceso.cs
namespace Votapp.Domain.ValueObjects
{
    public class CodigoAcceso
    {
        public string Valor { get; private set; }

        private CodigoAcceso(string valor)
        {
            Valor = valor;
        }

        public static CodigoAcceso Generar()
        {
            // Generar 6 caracteres alfanuméricos (excluir I, O, 1, L)
            const string caracteres = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
            var random = new Random();
            var codigo = new string(Enumerable.Range(0, 6)
                .Select(_ => caracteres[random.Next(caracteres.Length)])
                .ToArray());
            
            return new CodigoAcceso(codigo);
        }

        public static CodigoAcceso Crear(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor) || valor.Length != 6)
                throw new ArgumentException("Código debe tener 6 caracteres");
            
            return new CodigoAcceso(valor.ToUpper());
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Value Object creado (opcional pero recomendado)
- [ ] Lógica de generación funciona

---

#### Tarea 1.4: Crear Interfaces de Repositorio (Domain/Interfaces)
**Descripción**: Contratos que define el dominio

**Estructura**:
```
Votapp.Domain/
└── Interfaces/
    ├── IRepository.cs           (Generic base)
    ├── IUserRepository.cs
    ├── IVotacionRepository.cs
    ├── IVotoRepository.cs
    └── IUnitOfWork.cs
```

**Ejemplo 1 - `IRepository.cs` (Generic Base)**:
```csharp
// Votapp.Domain/Interfaces/IRepository.cs
namespace Votapp.Domain.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(int id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity> AddAsync(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        Task SaveChangesAsync();
    }
}
```

**Ejemplo 2 - `IUserRepository.cs`**:
```csharp
// Votapp.Domain/Interfaces/IUserRepository.cs
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
    }
}
```

**Ejemplo 3 - `IVotacionRepository.cs`**:
```csharp
// Votapp.Domain/Interfaces/IVotacionRepository.cs
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IVotacionRepository : IRepository<Votacion>
    {
        Task<Votacion?> GetByCodigoAccesoAsync(string codigo);
        Task<IEnumerable<Votacion>> GetByCreadorAsync(int creadorId);
        Task<bool> CodigoAccesoExistsAsync(string codigo);
        Task<Votacion?> GetWithOpcionsAsync(int id);
    }
}
```

**Ejemplo 4 - `IVotoRepository.cs`**:
```csharp
// Votapp.Domain/Interfaces/IVotoRepository.cs
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IVotoRepository : IRepository<Voto>
    {
        Task<bool> UsuarioYaVotoAsync(int votacionId, int usuarioId);
        Task<IEnumerable<Voto>> GetByVotacionAsync(int votacionId);
        Task<int> ContarVotosPorOpcionAsync(int opcionId);
    }
}
```

**Ejemplo 5 - `IUnitOfWork.cs`**:
```csharp
// Votapp.Domain/Interfaces/IUnitOfWork.cs
namespace Votapp.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IVotacionRepository Votaciones { get; }
        IVotoRepository Votos { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Todas las interfaces creadas
- [ ] Compilación sin errores
- [ ] Métodos reflejan las reglas de negocio (RN-02, RN-05, etc.)

---

### FASE 2: APPLICATION LAYER (DTOs y Validadores)

#### Tarea 2.1: Crear DTOs (Application/DTOs)
**Descripción**: Objetos de transferencia de datos (requests y responses)

**Estructura**:
```
Votapp.Application/
└── DTOs/
    ├── User/
    │   ├── CreateUserRequest.cs
    │   ├── LoginRequest.cs
    │   └── UserResponse.cs
    ├── Votacion/
    │   ├── CreateVotacionRequest.cs
    │   ├── VotacionResponse.cs
    │   └── VotacionDetalleResponse.cs
    └── Voto/
        ├── EmitirVotoRequest.cs
        └── VotoResponse.cs
```

**Ejemplo 1 - `CreateUserRequest.cs`**:
```csharp
// Votapp.Application/DTOs/User/CreateUserRequest.cs
namespace Votapp.Application.DTOs.User
{
    public class CreateUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
    }
}
```

**Ejemplo 2 - `CreateVotacionRequest.cs`**:
```csharp
// Votapp.Application/DTOs/Votacion/CreateVotacionRequest.cs
namespace Votapp.Application.DTOs.Votacion
{
    public class CreateVotacionRequest
    {
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public List<string> Opciones { get; set; } = new();
    }
}
```

**Ejemplo 3 - `EmitirVotoRequest.cs`**:
```csharp
// Votapp.Application/DTOs/Voto/EmitirVotoRequest.cs
namespace Votapp.Application.DTOs.Voto
{
    public class EmitirVotoRequest
    {
        public string CodigoAcceso { get; set; } = string.Empty;
        public int OpcionSeleccionadaId { get; set; }
    }
}
```

**Ejemplo 4 - `VotacionResponse.cs`**:
```csharp
// Votapp.Application/DTOs/Votacion/VotacionResponse.cs
namespace Votapp.Application.DTOs.Votacion
{
    public class VotacionResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string CodigoAcceso { get; set; } = string.Empty;
        public List<OpcionResponse> Opciones { get; set; } = new();
    }

    public class OpcionResponse
    {
        public int Id { get; set; }
        public string Texto { get; set; } = string.Empty;
        public int VotosRecibidos { get; set; }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] DTOs creados para las 3 entidades principales
- [ ] Propiedades coinciden con campos esperados
- [ ] Compilación exitosa

---

#### Tarea 2.2: Crear Validadores Fluent (Application/Validators)
**Descripción**: Reglas de validación usando FluentValidation

**Estructura**:
```
Votapp.Application/
└── Validators/
    ├── CreateUserValidator.cs
    ├── CreateVotacionValidator.cs
    └── EmitirVotoValidator.cs
```

**Ejemplo 1 - `CreateUserValidator.cs`**:
```csharp
// Votapp.Application/Validators/CreateUserValidator.cs
using FluentValidation;
using Votapp.Application.DTOs.User;

namespace Votapp.Application.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserRequest>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email es requerido")
                .EmailAddress().WithMessage("Email debe ser válido");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password es requerido")
                .MinimumLength(6).WithMessage("Password debe tener al menos 6 caracteres");

            RuleFor(x => x.NombreCompleto)
                .NotEmpty().WithMessage("Nombre completo es requerido")
                .MinimumLength(3).WithMessage("Nombre debe tener al menos 3 caracteres");
        }
    }
}
```

**Ejemplo 2 - `CreateVotacionValidator.cs`**:
```csharp
// Votapp.Application/Validators/CreateVotacionValidator.cs
using FluentValidation;
using Votapp.Application.DTOs.Votacion;

namespace Votapp.Application.Validators
{
    public class CreateVotacionValidator : AbstractValidator<CreateVotacionRequest>
    {
        public CreateVotacionValidator()
        {
            RuleFor(x => x.Titulo)
                .NotEmpty().WithMessage("Título es requerido")
                .MinimumLength(5).WithMessage("Título debe tener al menos 5 caracteres");

            RuleFor(x => x.Descripcion)
                .NotEmpty().WithMessage("Descripción es requerida");

            RuleFor(x => x.Opciones)
                .NotEmpty().WithMessage("Debe haber al menos una opción")
                .Must(o => o.Count >= 2)
                .WithMessage("Debe haber al menos 2 opciones"); // RN-03

            RuleFor(x => x.FechaInicio)
                .Must((req, fecha) => fecha < req.FechaCierre)
                .WithMessage("Fecha inicio debe ser menor a fecha cierre"); // RN-04

            RuleFor(x => x.FechaCierre)
                .GreaterThan(x => x.FechaInicio)
                .WithMessage("Fecha cierre debe ser mayor a fecha inicio");
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Validadores creados para principales DTOs
- [ ] Validan reglas de negocio (RN-03, RN-04)
- [ ] Se compilan exitosamente

---

### FASE 3: INFRASTRUCTURE LAYER (DbContext y Repositories)

#### Tarea 3.1: Crear DbContext (Infrastructure/Persistence)
**Descripción**: Configurar Entity Framework Core con MySQL

**Estructura**:
```
Votapp.Infrastructure/
└── Persistence/
    ├── VotappDbContext.cs
    └── Migrations/ (generado automáticamente)
```

**Ejemplo - `VotappDbContext.cs`**:
```csharp
// Votapp.Infrastructure/Persistence/VotappDbContext.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Entities;

namespace Votapp.Infrastructure.Persistence
{
    public class VotappDbContext : DbContext
    {
        public VotappDbContext(DbContextOptions<VotappDbContext> options) 
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Votacion> Votaciones { get; set; }
        public DbSet<VotacionOpcion> VotacionOpciones { get; set; }
        public DbSet<Voto> Votos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.NombreCompleto).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configurar Votacion
            modelBuilder.Entity<Votacion>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Titulo).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Descripcion).IsRequired();
                entity.Property(e => e.CodigoAcceso).IsRequired().HasMaxLength(6);
                entity.Property(e => e.Estado).HasConversion<int>();
                entity.HasIndex(e => e.CodigoAcceso).IsUnique();
                
                // Relación con User (creador)
                entity.HasOne(e => e.Creador)
                    .WithMany(u => u.VotacionesCreadas)
                    .HasForeignKey(e => e.CreadorId);
            });

            // Configurar VotacionOpcion
            modelBuilder.Entity<VotacionOpcion>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Texto).IsRequired().HasMaxLength(500);
                
                entity.HasOne(e => e.Votacion)
                    .WithMany(v => v.Opciones)
                    .HasForeignKey(e => e.VotacionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configurar Voto
            modelBuilder.Entity<Voto>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.VotosEmitidos)
                    .HasForeignKey(e => e.UsuarioId);

                entity.HasOne(e => e.Votacion)
                    .WithMany(v => v.Votos)
                    .HasForeignKey(e => e.VotacionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.OpcionSeleccionada)
                    .WithMany(o => o.VotosRecibidos)
                    .HasForeignKey(e => e.OpcionSeleccionadaId);

                // RN-02: Un voto por usuario por votación
                entity.HasIndex(e => new { e.VotacionId, e.UsuarioId }).IsUnique();
            });
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] DbContext creado y se compila
- [ ] Todas las entidades mapeadas
- [ ] Índices para unicidad (CodigoAcceso, Email, un voto por usuario)

---

#### Tarea 3.2: Crear Repositories (Infrastructure/Persistence/Repositories)
**Descripción**: Implementar los repositorios concretos

**Estructura**:
```
Votapp.Infrastructure/
└── Persistence/
    └── Repositories/
        ├── Repository.cs          (Generic base)
        ├── UserRepository.cs
        ├── VotacionRepository.cs
        ├── VotoRepository.cs
        └── UnitOfWork.cs
```

**Ejemplo 1 - `Repository.cs` (Generic Base)**:
```csharp
// Votapp.Infrastructure/Persistence/Repositories/Repository.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly VotappDbContext _context;

        public Repository(VotappDbContext context)
        {
            _context = context;
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public void Update(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
        }

        public void Delete(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
```

**Ejemplo 2 - `UserRepository.cs`**:
```csharp
// Votapp.Infrastructure/Persistence/Repositories/UserRepository.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Entities;
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly VotappDbContext _context;

        public UserRepository(VotappDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}
```

**Ejemplo 3 - `VotacionRepository.cs`**:
```csharp
// Votapp.Infrastructure/Persistence/Repositories/VotacionRepository.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Entities;
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class VotacionRepository : Repository<Votacion>, IVotacionRepository
    {
        private readonly VotappDbContext _context;

        public VotacionRepository(VotappDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Votacion?> GetByCodigoAccesoAsync(string codigo)
        {
            return await _context.Votaciones
                .FirstOrDefaultAsync(v => v.CodigoAcceso == codigo.ToUpper());
        }

        public async Task<IEnumerable<Votacion>> GetByCreadorAsync(int creadorId)
        {
            return await _context.Votaciones
                .Where(v => v.CreadorId == creadorId)
                .ToListAsync();
        }

        public async Task<bool> CodigoAccesoExistsAsync(string codigo)
        {
            return await _context.Votaciones
                .AnyAsync(v => v.CodigoAcceso == codigo.ToUpper());
        }

        public async Task<Votacion?> GetWithOpcionsAsync(int id)
        {
            return await _context.Votaciones
                .Include(v => v.Opciones)
                .FirstOrDefaultAsync(v => v.Id == id);
        }
    }
}
```

**Ejemplo 4 - `VotoRepository.cs`**:
```csharp
// Votapp.Infrastructure/Persistence/Repositories/VotoRepository.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Entities;
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class VotoRepository : Repository<Voto>, IVotoRepository
    {
        private readonly VotappDbContext _context;

        public VotoRepository(VotappDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> UsuarioYaVotoAsync(int votacionId, int usuarioId)
        {
            // RN-02: Verificar que no hay dos votos del mismo usuario en la misma votación
            return await _context.Votos
                .AnyAsync(v => v.VotacionId == votacionId && v.UsuarioId == usuarioId);
        }

        public async Task<IEnumerable<Voto>> GetByVotacionAsync(int votacionId)
        {
            return await _context.Votos
                .Where(v => v.VotacionId == votacionId)
                .ToListAsync();
        }

        public async Task<int> ContarVotosPorOpcionAsync(int opcionId)
        {
            return await _context.Votos
                .CountAsync(v => v.OpcionSeleccionadaId == opcionId);
        }
    }
}
```

**Ejemplo 5 - `UnitOfWork.cs`**:
```csharp
// Votapp.Infrastructure/Persistence/Repositories/UnitOfWork.cs
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly VotappDbContext _context;
        private IUserRepository? _userRepository;
        private IVotacionRepository? _votacionRepository;
        private IVotoRepository? _votoRepository;

        public UnitOfWork(VotappDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users
            => _userRepository ??= new UserRepository(_context);

        public IVotacionRepository Votaciones
            => _votacionRepository ??= new VotacionRepository(_context);

        public IVotoRepository Votos
            => _votoRepository ??= new VotoRepository(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task RollbackAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] Repository base y específicos creados
- [ ] Métodos reflejan validaciones de RN
- [ ] UnitOfWork coordina múltiples repositorios
- [ ] Compilación exitosa

---

#### Tarea 3.3: Crear Migration Inicial (EF Core)
**Descripción**: Generar scripts SQL para crear tablas

**Comandos a ejecutar**:
```powershell
# Desde la raíz del proyecto Backend.Votapp

# 1. Agregar migration inicial
dotnet ef migrations add InitialCreate --project Votapp.Infrastructure --startup-project Votapp.API

# 2. Aplicar migration a la BD
dotnet ef database update --project Votapp.Infrastructure --startup-project Votapp.API
```

**Resultado esperado**:
- Tablas creadas en MySQL:
  - Users
  - Votaciones
  - VotacionOpciones
  - Votos

**Criterio de Aceptación** ✅:
- [ ] Comando `dotnet ef migrations add` ejecutado exitosamente
- [ ] Archivo de migration creado en `Infrastructure/Migrations/`
- [ ] Base de datos conectada y tablas creadas

---

### FASE 4: PRESENTATION LAYER (Controllers y DI)

#### Tarea 4.1: Configurar Dependency Injection (Program.cs)
**Descripción**: Registrar servicios en DI Container

**Archivo a editar**: `Votapp.API/Program.cs`

**Ejemplo**:
```csharp
// Votapp.API/Program.cs
using Microsoft.EntityFrameworkCore;
using Votapp.Infrastructure.Persistence;
using Votapp.Infrastructure.Persistence.Repositories;
using Votapp.Domain.Interfaces;
using FluentValidation;

var builder = WebApplicationBuilder.CreateBuilder(args);

// 1. Agregar DbContext
builder.Services.AddDbContext<VotappDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

// 2. Agregar Repositories y UnitOfWork
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// 3. Agregar FluentValidation
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

// 4. Agregar Controllers
builder.Services.AddControllers();

// 5. Agregar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

**También necesitas agregar en `appsettings.json`**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VotappMVP;User=root;Password=tu_contraseña;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Criterio de Aceptación** ✅:
- [ ] DI configurado en Program.cs
- [ ] Connection string en appsettings.json
- [ ] Aplicación arranca sin errores: `dotnet run`

---

#### Tarea 4.2: Crear Controller Base (API/Controllers)
**Descripción**: BaseController reutilizable con respuestas estándar

**Estructura**:
```
Votapp.API/
└── Controllers/
    ├── BaseController.cs
    ├── AuthController.cs
    ├── VotacionesController.cs
    └── VotosController.cs
```

**Ejemplo 1 - `BaseController.cs`**:
```csharp
// Votapp.API/Controllers/BaseController.cs
using Microsoft.AspNetCore.Mvc;

namespace Votapp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        protected IActionResult SuccessResponse<T>(T data, string message = "Operación exitosa", int status = 200)
        {
            return StatusCode(status, new
            {
                success = true,
                message,
                data,
                timestamp = DateTime.UtcNow
            });
        }

        protected IActionResult ErrorResponse(string message, int status = 400)
        {
            return StatusCode(status, new
            {
                success = false,
                message,
                timestamp = DateTime.UtcNow
            });
        }

        protected IActionResult ValidationErrorResponse(Dictionary<string, string> errors)
        {
            return StatusCode(400, new
            {
                success = false,
                message = "Errores de validación",
                errors,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] BaseController creado
- [ ] Métodos helper para respuestas estándar
- [ ] Se compila exitosamente

---

#### Tarea 4.3: Crear AuthController (API/Controllers)
**Descripción**: Endpoints para registro e inicio de sesión

**Ejemplo**:
```csharp
// Votapp.API/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Votapp.Application.DTOs.User;
using Votapp.Domain.Interfaces;
using FluentValidation;

namespace Votapp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IValidator<CreateUserRequest> _userValidator;

        public AuthController(IUnitOfWork unitOfWork, IValidator<CreateUserRequest> userValidator)
        {
            _unitOfWork = unitOfWork;
            _userValidator = userValidator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserRequest request)
        {
            // 1. Validar con FluentValidation
            var validation = await _userValidator.ValidateAsync(request);
            if (!validation.IsValid)
            {
                var errors = validation.Errors.ToDictionary(e => e.PropertyName, e => e.ErrorMessage);
                return ValidationErrorResponse(errors);
            }

            // 2. Verificar si email existe
            var emailExists = await _unitOfWork.Users.EmailExistsAsync(request.Email);
            if (emailExists)
                return ErrorResponse("El email ya está registrado", 400);

            // 3. Crear usuario (simplificado, sin encriptación aquí)
            var user = new Votapp.Domain.Entities.User
            {
                Email = request.Email,
                PasswordHash = request.Password, // TODO: Encriptar
                NombreCompleto = request.NombreCompleto,
                FechaCreacion = DateTime.UtcNow
            };

            // 4. Guardar
            await _unitOfWork.Users.AddAsync(user);

            return SuccessResponse(new { id = user.Id, email = user.Email }, "Usuario registrado exitosamente", 201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // TODO: Implementar JWT
            return ErrorResponse("No implementado aún", 501);
        }
    }
}
```

**Criterio de Aceptación** ✅:
- [ ] AuthController creado
- [ ] Endpoints register y login definidos
- [ ] Validación con FluentValidation
- [ ] Respuestas estándar

---

---

## 🎯 RESUMEN DE TAREAS POR FASE

| Fase | Tareas | Duración Estimada | Reglas de Negocio |
|------|--------|-------------------|-------------------|
| **0** | Proyecto base + NuGet | 30 min | N/A |
| **1** | Domain Layer (Entities, Enums, Interfaces) | 1-2 horas | RN-01 a RN-10 (definidas) |
| **2** | Application Layer (DTOs, Validators) | 1 hora | RN-03, RN-04 validadas |
| **3** | Infrastructure Layer (DbContext, Repos, UnitOfWork) | 2 horas | RN-02, RN-05 (índices únicos) |
| **4** | Presentation Layer (Controllers, DI) | 1-2 horas | N/A (coordina todo) |
| **TOTAL** | Todas | **~6-7 horas** | **Completas** |

---

## 🚀 RECOMENDACIÓN FINAL

### Próximos Pasos:
1. ✅ Lee este documento completo
2. ✅ Entiende la estructura propuesta
3. ✅ Ejecuta las tareas de **FASE 0** (setup proyecto)
4. ✅ Luego FASE 1 (Domain Layer) - es la más crítica
5. ✅ Luego FASE 2 y 3 en paralelo
6. ✅ Al final FASE 4 (Controllers)

### Cuando tengas dudas:
- Pregúntame sobre tareas específicas
- Pide que expanda algún ejemplo
- Solicita ayuda con debugging

### Este checklist:
- Será tu guía paso a paso
- Lo refinarás según avances
- Lo mantendrás actualizado

---

**¿Empezamos con FASE 0 (Setup)?**

Confirma que entiendes todo y avanzamos. 🚀

