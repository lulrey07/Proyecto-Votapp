# 🏗️ GUÍA & CHECKLIST UNIFICADA - BACKEND Votapp MVP

**Propósito:** Documento único para implementar el backend de Votapp MVP con Clean Architecture, integrando explicaciones, ejemplos y pasos accionables.

---

## 📚 Introducción y Terminología

- **Scaffold:** Crear la estructura base/esqueleto de un proyecto.
- **Clean Architecture:** Separación en capas: Domain, Application, Infrastructure, Presentation.
- **POCO:** Clases simples sin dependencias externas.

---

## 🎯 FASE 0: PREPARACIÓN INICIAL

### 0.1 Estructura Base y Setup

**Recomendación:** Solución con múltiples proyectos.

```
Backend.Votapp.sln
├── src/
│   ├── Backend.Votapp.Domain/
│   ├── Backend.Votapp.Application/
│   ├── Backend.Votapp.Infrastructure/
│   └── Backend.Votapp.Presentation/
└── tests/
    ├── Backend.Votapp.Domain.Tests/
    ├── Backend.Votapp.Application.Tests/
    └── Backend.Votapp.Integration.Tests/
```

**Comandos PowerShell:**
```powershell
cd c:\Users\franc\Proyecto Votapp\Backend.Votapp
# Crear solución y proyectos
...existing code...
```

**NuGet Packages recomendados:**
- Microsoft.Extensions.Logging, Serilog
- EntityFrameworkCore, Pomelo.EntityFrameworkCore.MySql
- FluentValidation, AutoMapper, MediatR
- Microsoft.AspNetCore.SignalR, JwtBearer, Swagger
- xUnit, Moq, FluentAssertions

**Connection String ejemplo:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VotappMVP;User Id=root;Password=tuPassword;"
  }
}
```

---

## 🏛️ FASE 1: DOMAIN LAYER (Entidades, Enums, Value Objects, Interfaces)

### 1.1 Entidades POCO y Relaciones

- **Usuario**
- **Votacion**
- **Voto**
- **VotacionOpcion**

**Ejemplo con navegación:**
```csharp
public class User {
    public int Id { get; set; }
    public string Email { get; set; }
    ...existing code...
    public ICollection<Votacion> VotacionesCreadas { get; set; }
    public ICollection<Voto> VotosEmitidos { get; set; }
}

public class Votacion {
    public int Id { get; set; }
    ...existing code...
    public User? Creador { get; set; }
    public ICollection<VotacionOpcion> Opciones { get; set; }
    public ICollection<Voto> Votos { get; set; }
}

public class Voto {
    public int Id { get; set; }
    ...existing code...
    public Votacion? Votacion { get; set; }
    public User? Usuario { get; set; }
    public VotacionOpcion? OpcionSeleccionada { get; set; }
}

public class VotacionOpcion {
    public int Id { get; set; }
    ...existing code...
    public Votacion? Votacion { get; set; }
    public ICollection<Voto> VotosRecibidos { get; set; }
}
```

### 1.2 Enums
```csharp
public enum EstadoVotacion { Paused = 0, Activa = 1, Finalizada = 2 }
public enum RoleUsuario { Administrator = 0, Voter = 1 }
```

### 1.3 Value Objects (Opcional pero recomendado)
```csharp
public class CodigoAcceso {
    public string Valor { get; private set; }
    ...existing code...
}
```

### 1.4 Interfaces de Repositorio
- IRepository<TEntity>
- IUserRepository
- IVotacionRepository
- IVotoRepository
- IUnitOfWork

---

## 🧩 FASE 2: APPLICATION LAYER (DTOs, Validadores)

### 2.1 DTOs
- User: CreateUserRequest, LoginRequest, UserResponse
- Votacion: CreateVotacionRequest, VotacionResponse, VotacionDetalleResponse
- Voto: EmitirVotoRequest, VotoResponse

### 2.2 Validadores FluentValidation
- CreateUserValidator
- CreateVotacionValidator
- EmitirVotoValidator

**Ejemplo:**
```csharp
public class CreateVotacionValidator : AbstractValidator<CreateVotacionRequest> {
    public CreateVotacionValidator() {
        RuleFor(x => x.Titulo).NotEmpty();
        RuleFor(x => x.Opciones).Must(o => o != null && o.Count >= 2);
        RuleFor(x => x.FechaInicio).LessThan(x => x.FechaCierre);
    }
}
```

---

## 🗄️ FASE 3: INFRASTRUCTURE LAYER (DbContext, Repositorios, Migrations)

### 3.1 DbContext y Relaciones
```csharp
public class VotappDbContext : DbContext {
    public DbSet<User> Users { get; set; }
    public DbSet<Votacion> Votaciones { get; set; }
    public DbSet<VotacionOpcion> VotacionOpciones { get; set; }
    public DbSet<Voto> Votos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        ...existing code...
        // Relaciones
        modelBuilder.Entity<Votacion>()
            .HasMany(v => v.Opciones)
            .WithOne(o => o.Votacion)
            .HasForeignKey(o => o.VotacionId);
        modelBuilder.Entity<Votacion>()
            .HasMany(v => v.Votos)
            .WithOne(vt => vt.Votacion)
            .HasForeignKey(vt => vt.VotacionId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.VotacionesCreadas)
            .WithOne(v => v.Creador)
            .HasForeignKey(v => v.CreadorId);
        modelBuilder.Entity<User>()
            .HasMany(u => u.VotosEmitidos)
            .WithOne(vt => vt.Usuario)
            .HasForeignKey(vt => vt.UsuarioId);
        // Índices únicos
        modelBuilder.Entity<Votacion>().HasIndex(v => v.CodigoAcceso).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Voto>().HasIndex(v => new { v.VotacionId, v.UsuarioId }).IsUnique();
    }
}
```

### 3.2 Repositorios y UnitOfWork
- Repository<TEntity>
- UserRepository, VotacionRepository, VotoRepository
- UnitOfWork

### 3.3 Migrations
```powershell
dotnet ef migrations add InitialCreate --project Backend.Votapp.Infrastructure --startup-project Backend.Votapp.Presentation
dotnet ef database update --project Backend.Votapp.Infrastructure --startup-project Backend.Votapp.Presentation
```

---

## 🌐 FASE 4: PRESENTATION LAYER (Controllers, DI, Program.cs)

### 4.1 Configuración de Dependency Injection
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<VotappDbContext>(...);
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
...existing code...
```

### 4.2 Controllers
- BaseController (respuestas estándar)
- AuthController (registro/login)
- VotacionesController
- VotosController

**Ejemplo AuthController:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController {
    private readonly IUnitOfWork _unitOfWork;
    ...existing code...
}
```

---

## 🧪 FASE 5: TESTING

- Test de RN-02: Un voto por usuario
- Test de validaciones y reglas de negocio

**Ejemplo:**
```csharp
public class VotoServiceTests {
    [Fact]
    public async Task EmitirVoto_DebeFallarSiUsuarioYaVoto() {
        ...existing code...
    }
}
```

---

## 📝 RESUMEN FINAL Y RECOMENDACIONES

- Sigue el orden de fases para evitar errores.
- Mantén la estructura modular y separa responsabilidades.
- Usa los ejemplos como referencia y adapta según tu contexto.
- Documenta cada avance y comunica bloqueos.

---

**¿Listo para comenzar? Usa este documento como tu única referencia principal para el backend de Votapp MVP.**
