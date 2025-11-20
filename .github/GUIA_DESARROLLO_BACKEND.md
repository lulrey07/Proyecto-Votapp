# 🚀 GUÍA PASO A PASO - DESARROLLO DEL BACKEND

**Para**: Figueroa Lucas, Corbalan Mario  
**Objetivo**: Desarrollar TÚ el backend, con mis recomendaciones en cada paso  
**Enfoque**: Mentoría senior, no ejecución automática

---

## PARTE 1: Preparación Inicial

### 📌 Antes de comenzar

Necesitamos definir algunos detalles:

#### **1. Estructura Base del Proyecto**

¿Vas a crear una solución de Visual Studio (.sln) con múltiples proyectos o un proyecto único?

**Recomendación SENIOR**: Múltiples proyectos (Clean Architecture)

```
Backend.Votapp.sln
├── src/
│   ├── Backend.Votapp.Domain/           (Domain Layer)
│   ├── Backend.Votapp.Application/      (Application Layer)
│   ├── Backend.Votapp.Infrastructure/   (Infrastructure Layer)
│   └── Backend.Votapp.Presentation/     (Presentation Layer - API)
└── tests/
    ├── Backend.Votapp.Domain.Tests/
    ├── Backend.Votapp.Application.Tests/
    └── Backend.Votapp.Integration.Tests/
```

#### **2. Dependencias Necesarias**

**NuGet Packages Recomendados**:

```csharp
// TODOS LOS PROYECTOS
- Microsoft.Extensions.Logging
- Microsoft.Extensions.DependencyInjection
- Serilog (Logging)

// Infrastructure
- EntityFrameworkCore (y provider MySQL/PostgreSQL)
- EntityFrameworkCore.Tools (migrations)

// Application
- FluentValidation
- AutoMapper
- MediatR (opcional, para operaciones complejas)

// Presentation
- Microsoft.AspNetCore.SignalR
- Microsoft.AspNetCore.Authentication.JwtBearer
- Swashbuckle.AspNetCore (Swagger)

// Testing
- xUnit
- Moq
- FluentAssertions
```

#### **3. Database Connection String**

**¿Cuál usarás? MySQL o PostgreSQL?**

Recomendación: **MySQL** (más fácil para MVP)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VotappMVP;User Id=root;Password=tuPassword;"
  }
}
```

---

## PARTE 2: Crear la Estructura de Carpetas

### ✅ PASO 1: Crear la solución

**Lo que TÚ harás:**

1. Abre Visual Studio (o usa terminal)
2. Crea nueva solución: `Backend.Votapp.sln`
3. Crea 4 proyectos class library (.NET 9):
   - `Backend.Votapp.Domain`
   - `Backend.Votapp.Application`
   - `Backend.Votapp.Infrastructure`
   - `Backend.Votapp.Presentation` (ASP.NET Core Web API)

**Mi recomendación:**
```powershell
# En terminal, dentro de Backend.Votapp/
dotnet new sln -n Backend.Votapp
dotnet new classlib -n Backend.Votapp.Domain
dotnet new classlib -n Backend.Votapp.Application
dotnet new classlib -n Backend.Votapp.Infrastructure
dotnet new webapi -n Backend.Votapp.Presentation
```

**Cuando termines, me avisas y pasamos al Paso 2** ✋

---

## PARTE 3: Domain Layer (Entidades & Reglas)

### 📌 ¿Qué es Domain Layer?

- ✅ Las **clases POCO** (Plain Old C# Objects)
- ✅ Las **reglas de negocio** (RN-01 a RN-10)
- ✅ Los **Value Objects**
- ✅ Las **interfaces** que definen contratos
- ❌ NO tiene lógica de persistencia
- ❌ NO tiene lógica de API

### ✅ PASO 2: Crear Entidades de Dominio

**Entidades que necesitamos (según RN):**

1. **Usuario** (HU-U01, HU-U02)
   ```csharp
   public class Usuario
   {
       public string Id { get; set; }
       public string Email { get; set; }
       public string NombreUsuario { get; set; }
       public string ContraseñaHash { get; set; }
       public string Rol { get; set; } // "Administrador" o "Votante"
       public DateTime FechaCreacion { get; set; }
   }
   ```

2. **Votacion** (HU-V01, HU-V02)
   ```csharp
   public class Votacion
   {
       public string Id { get; set; }
       public string Titulo { get; set; }
       public string Descripcion { get; set; }
       public List<string> Opciones { get; set; } // RN-03: Min 2
       public DateTime FechaInicio { get; set; }
       public DateTime FechaCierre { get; set; }
       public string Estado { get; set; } // "Pausa", "Activa", "Finalizada" (RN-09)
       public string CodigoAcceso { get; set; } // RN-05: Único
       public string CreadorId { get; set; }
       public int ParticipantesCount { get; set; }
   }
   ```

3. **Voto** (HU-P02)
   ```csharp
   public class Voto
   {
       public string Id { get; set; }
       public string VotacionId { get; set; }
       public string UsuarioId { get; set; }
       public int OpcionSeleccionada { get; set; } // Índice de opción (0, 1, 2...)
       public DateTime FechaEmision { get; set; }
       // RN-08: Inmutable después de aquí
   }
   ```

4. **Enums**
   ```csharp
   public enum EstadoVotacion
   {
       Pausa = 0,
       Activa = 1,
       Finalizada = 2
   }

   public enum RoleUsuario
   {
       Votante = 0,
       Administrador = 1
   }
   ```

**Lo que TÚ harás:**

1. Dentro de `Backend.Votapp.Domain`
2. Crea carpeta `Entities`
3. Crea archivos: `Usuario.cs`, `Votacion.cs`, `Voto.cs`
4. Crea carpeta `Enums`
5. Crea archivos: `EstadoVotacion.cs`, `RoleUsuario.cs`

**Mi recomendación:** Haz las entidades lo más simples posible (propiedades auto-implementadas)

**Cuando termines, me avisas** ✋

---

## PARTE 4: Application Layer (DTOs & Validadores)

### 📌 ¿Qué es Application Layer?

- ✅ **DTOs** (Data Transfer Objects) para comunicación
- ✅ **Validadores** (Fluent Validation)
- ✅ **Exceptions** personalizadas
- ✅ **Interfaces** de servicios
- ❌ NO tiene código EF
- ❌ NO tiene HTTP

### ✅ PASO 3: Crear DTOs

**DTOs necesarios:**

```csharp
// Requests
public class CrearUsuarioRequest
{
    public string Email { get; set; }
    public string NombreUsuario { get; set; }
    public string Contraseña { get; set; }
}

public class CrearVotacionRequest
{
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
    public List<string> Opciones { get; set; } // RN-03: Min 2
    public DateTime FechaInicio { get; set; }
    public DateTime FechaCierre { get; set; }
}

public class EmitirVotoRequest
{
    public string VotacionId { get; set; }
    public int OpcionSeleccionada { get; set; }
    public string CodigoAcceso { get; set; }
}

// Responses
public class UsuarioResponse
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string NombreUsuario { get; set; }
    public string Rol { get; set; }
}

public class VotacionResponse
{
    public string Id { get; set; }
    public string Titulo { get; set; }
    public List<string> Opciones { get; set; }
    public string CodigoAcceso { get; set; }
    public string Estado { get; set; }
}
```

### ✅ PASO 4: Crear Validadores (Fluent Validation)

**Validador para CrearVotacionRequest:**

```csharp
public class CrearVotacionValidator : AbstractValidator<CrearVotacionRequest>
{
    public CrearVotacionValidator()
    {
        RuleFor(x => x.Titulo)
            .NotEmpty().WithMessage("Título es requerido");
        
        RuleFor(x => x.Opciones)
            .Must(o => o != null && o.Count >= 2)
            .WithMessage("Mínimo 2 opciones requeridas"); // RN-03
        
        RuleFor(x => x.FechaInicio)
            .LessThan(x => x.FechaCierre)
            .WithMessage("Fecha inicio debe ser antes que fecha cierre"); // RN-04
    }
}
```

**Lo que TÚ harás:**

1. En `Backend.Votapp.Application`
2. Crea carpetas: `DTOs`, `Validators`
3. Crea los DTOs en `DTOs/`
4. Crea los validadores en `Validators/`

**Cuando termines, me avisas** ✋

---

## PARTE 5: Infrastructure Layer (Database & Repositories)

### 📌 ¿Qué es Infrastructure Layer?

- ✅ **DbContext** (Entity Framework)
- ✅ **Repositories** (acceso a datos)
- ✅ **UnitOfWork** (coordina transacciones)
- ✅ **Migrations** (control de BD)

### ✅ PASO 5: Crear DbContext

**Lo que TÚ harás:**

1. En `Backend.Votapp.Infrastructure`
2. Crea carpeta `Persistence`
3. Crea archivo `VotappDbContext.cs`:

```csharp
public class VotappDbContext : DbContext
{
    public VotappDbContext(DbContextOptions<VotappDbContext> options) 
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Votacion> Votaciones { get; set; }
    public DbSet<Voto> Votos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuraciones de BD
        modelBuilder.Entity<Usuario>().HasKey(u => u.Id);
        modelBuilder.Entity<Votacion>().HasKey(v => v.Id);
        modelBuilder.Entity<Voto>().HasKey(v => v.Id);
        
        // RN-05: Código único
        modelBuilder.Entity<Votacion>()
            .HasIndex(v => v.CodigoAcceso)
            .IsUnique();
        
        // RN-02: Un voto por usuario por votación
        modelBuilder.Entity<Voto>()
            .HasIndex(v => new { v.VotacionId, v.UsuarioId })
            .IsUnique();
    }
}
```

### ✅ PASO 6: Crear Repositories

**Interface de Repository Genérico:**

```csharp
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(string id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
```

**Implementación:**

```csharp
public class Repository<T> : IRepository<T> where T : class
{
    private readonly VotappDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(VotappDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T> GetByIdAsync(string id)
        => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public async Task AddAsync(T entity)
        => await _dbSet.AddAsync(entity);

    public async Task UpdateAsync(T entity)
        => _dbSet.Update(entity);

    public async Task DeleteAsync(T entity)
        => _dbSet.Remove(entity);
}
```

**Lo que TÚ harás:**

1. En `Backend.Votapp.Infrastructure/Persistence`
2. Crea `IRepository.cs` (interface genérico)
3. Crea `Repository.cs` (implementación)
4. Crea interfaces específicas si es necesario:
   - `IVotacionRepository`
   - `IVotoRepository`
   - `IUsuarioRepository`

**Cuando termines, me avisas** ✋

---

## PARTE 6: Presentation Layer (API Controllers)

### 📌 ¿Qué es Presentation Layer?

- ✅ **API Controllers** (endpoints REST)
- ✅ **Middleware** (error handling)
- ✅ **Dependency Injection** setup
- ✅ **Program.cs** configuración

### ✅ PASO 7: Configurar Program.cs (Dependency Injection)

**Lo que TÚ harás en `Backend.Votapp.Presentation/Program.cs`:**

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Agregar servicios
builder.Services.AddControllers();

// 2. DbContext
builder.Services.AddDbContext<VotappDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21))
    )
);

// 3. Repositories (Dependency Injection)
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 4. Validadores
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// 5. Swagger
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware
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

### ✅ PASO 8: Crear Primer Controller

**Ejemplo: UsuariosController**

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CrearUsuarioRequest> _validator;

    public UsuariosController(IUnitOfWork unitOfWork, IValidator<CrearUsuarioRequest> validator)
    {
        _unitOfWork = unitOfWork;
        _validator = validator;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] CrearUsuarioRequest request)
    {
        // 1. Validar
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        // 2. Crear usuario
        var usuario = new Usuario
        {
            Id = Guid.NewGuid().ToString(),
            Email = request.Email,
            NombreUsuario = request.NombreUsuario,
            ContraseñaHash = BCrypt.Net.BCrypt.HashPassword(request.Contraseña),
            Rol = "Votante",
            FechaCreacion = DateTime.UtcNow
        };

        // 3. Guardar
        await _unitOfWork.Usuarios.AddAsync(usuario);
        await _unitOfWork.SaveChangesAsync();

        // 4. Retornar
        return Ok(new { mensaje = "Usuario registrado correctamente" });
    }
}
```

**Lo que TÚ harás:**

1. En `Backend.Votapp.Presentation/Controllers`
2. Crea `UsuariosController.cs`
3. Implementa endpoint `/api/usuarios/registrar`

**Cuando termines, me avisas** ✋

---

## PARTE 7: Setup de la Base de Datos

### ✅ PASO 9: Migrations de Entity Framework

**Lo que TÚ harás:**

En **Package Manager Console** (en Visual Studio):

```powershell
# Establecer proyecto default
Set-Location Backend.Votapp.Infrastructure

# Crear primera migration
Add-Migration InitialCreate -Context VotappDbContext

# Aplicar migration a BD
Update-Database -Context VotappDbContext
```

**Esto crea las tablas en MySQL/PostgreSQL**

---

## PARTE 8: Testing Básico

### ✅ PASO 10: Test de RN-02 (Un voto por usuario)

**En `Backend.Votapp.Application.Tests`:**

```csharp
public class VotoServiceTests
{
    [Fact]
    public async Task EmitirVoto_DebeFallarSiUsuarioYaVoto()
    {
        // Arrange - Preparar datos
        var votacionId = "vot-001";
        var usuarioId = "user-001";
        var dbContext = new VotappDbContext(); // Mock
        
        // Agregar primer voto
        var voto1 = new Voto { VotacionId = votacionId, UsuarioId = usuarioId };
        await dbContext.Votos.AddAsync(voto1);
        await dbContext.SaveChangesAsync();
        
        // Act - Intentar agregar segundo voto
        var voto2 = new Voto { VotacionId = votacionId, UsuarioId = usuarioId };
        
        // Assert - Debe fallar (RN-02)
        var ex = await Assert.ThrowsAsync<DbUpdateException>(() => 
            dbContext.Votos.AddAsync(voto2)
        );
        
        Assert.NotNull(ex); // Unique constraint violation
    }
}
```

---

## PARTE 9: Estructura Final

Cuando completes todo, tu estructura verá así:

```
Backend.Votapp/
├── Backend.Votapp.sln
├── src/
│   ├── Backend.Votapp.Domain/
│   │   ├── Entities/
│   │   │   ├── Usuario.cs
│   │   │   ├── Votacion.cs
│   │   │   └── Voto.cs
│   │   ├── Enums/
│   │   │   ├── EstadoVotacion.cs
│   │   │   └── RoleUsuario.cs
│   │   └── Backend.Votapp.Domain.csproj
│   │
│   ├── Backend.Votapp.Application/
│   │   ├── DTOs/
│   │   │   ├── CrearUsuarioRequest.cs
│   │   │   └── ... más DTOs
│   │   ├── Validators/
│   │   │   └── CrearVotacionValidator.cs
│   │   ├── Exceptions/
│   │   ├── Interfaces/
│   │   └── Backend.Votapp.Application.csproj
│   │
│   ├── Backend.Votapp.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── VotappDbContext.cs
│   │   │   ├── Repository.cs
│   │   │   ├── UnitOfWork.cs
│   │   │   └── Migrations/
│   │   └── Backend.Votapp.Infrastructure.csproj
│   │
│   └── Backend.Votapp.Presentation/
│       ├── Controllers/
│       │   ├── UsuariosController.cs
│       │   ├── VotacionesController.cs
│       │   └── VotosController.cs
│       ├── Middleware/
│       ├── appsettings.json
│       ├── Program.cs
│       └── Backend.Votapp.Presentation.csproj
│
└── tests/
    └── Backend.Votapp.Application.Tests/
```

---

## 🚀 PRÓXIMO PASO

**Ahora es tu turno:**

1. ¿Estás listo para comenzar?
2. ¿Tienes alguna pregunta sobre la estructura?
3. ¿Qué paso quieres que hagamos primero?

**Escribime y empezamos.** 🎯

---

## 📞 Cómo Proceder

Cuando completes cada paso, me lo comunicas así:

```
✅ PASO 2 COMPLETADO - Estructura de carpetas creada
- Proyectos: Domain, Application, Infrastructure, Presentation
- ¿Siguiente paso?
```

Yo verifico que todo esté correcto y te doy el siguiente paso + recomendaciones específicas.

**Entiendo que es tu primera vez con Clean Architecture, así que iremos lento pero seguro.** 💪

---

## 🔁 Actualizaciones (2025-11-20)

Se han incorporado decisiones técnicas y documentación adicional al repositorio para orientar la implementación backend del MVP. Revisa los documentos ligados en la carpeta `.github/` para alinearte con el flujo y las migraciones.

- **Documentos nuevos / actualizados**:
    - `.github/WORKFLOW_SISTEMA.md`: workflow completo del sistema (registro, ciclo de vida de votaciones, participación contextual, manejo de race conditions, autorización basada en recursos, arquitectura de BD).
    - `.github/Respuestas de Copilot/CHECKLIST_IMPLEMENTACION_BACKEND.md`: checklist ampliado por fases (0–4) con ejemplos de código, mapeos de `VotappDbContext`, repositorios, UnitOfWork, controllers y handlers de autorización.

- **Decisiones técnicas clave (resumen práctico)**:
    - Persistencia: usar **Entity Framework Core** con **MySQL** (migraciones EF y constraints en la BD).
    - Entidades críticas: `Votacion` (Aggregate Root), `Participacion` (rol contextual por votación) y `Voto`.
    - Integridad y race conditions:
        - Añadir índice UNIQUE en `Votos` sobre `(VotacionId, UsuarioId)` para garantizar RN-02 (un voto por usuario por votación).
        - Añadir índice UNIQUE en `Participaciones` sobre `(UsuarioId, VotacionId)` para garantizar RN-01 (un rol por usuario por votación).
        - Manejar `DbUpdateException` en la capa de repositorios/casos de uso para convertir violaciones de constraint en errores de negocio controlados.
    - Autorización: usar **authorization handlers** (resource-based) registrados en `Program.cs` para evaluar roles por votación (ej.: `SoyAdministradorVotacionRequirement` / `SoyVotanteActivoRequirement`). Las comprobaciones consultan la tabla `Participaciones`.
    - Seguridad: autenticación **JWT Bearer**; usar claim `sub` para identificar `UsuarioId` en handlers y controllers.
    - Real-time: planificar **SignalR** para emisión de resultados en tiempo real (PR / módulo dedicado).

- **PR-by-PR recomendadas (resumen)**:
    - PR1: `feature/solution-structure` — Crear la solución y proyectos base (FASE 0).
    - PR2: `feature/domain-entities` — Implementar entidades del dominio y enums (FASE 1).
    - PR3: `feature/infrastructure-dbcontext` — `VotappDbContext` y migración inicial (FASE 3). Incluir UNIQUE constraints para `Votos`, `Participaciones`, `Votacion.CodigoAcceso`.
    - PR4: `feature/application-services` — Repositorios, UnitOfWork y casos de uso (FASE 2/3). Añadir manejo de `DbUpdateException`.
    - PR5: `feature/presentation-api` — Controllers, JWT, policies/handlers de autorización (FASE 4).
    - PR6: `feature/signalr-results` — SignalR hub y emisión de eventos en tiempo real.
    - PR7: `feature/tests-ci` — Pruebas de integración y CI.

---

*Guía creada para ti*  
*Mentor: Senior Software Architect*  
*Proyecto: Votapp MVP 1*
