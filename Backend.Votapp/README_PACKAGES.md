# Política de versiones centralizadas (Directory.Packages.props)

Resumen corto sobre la gestión centralizada de paquetes NuGet en esta solución.

## Propósito

- Centralizar las versiones de paquetes NuGet para toda la solución.
- Evitar discrepancias entre proyectos y facilitar actualizaciones y revisiones.

## Ubicación

El archivo principal es `Directory.Packages.props` en la raíz de la solución (`Backend.Votapp/`).

## Qué deben hacer los proyectos

- En cada `.csproj` usar `PackageReference` sin `Version` cuando la dependencia esté listada en `Directory.Packages.props`:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore" />
</ItemGroup>
```

- Si por una razón justificada un proyecto necesita una versión distinta, documentarlo en el PR y especificar `Version` en el `PackageReference` (evitar salvo necesidad).

## Flujo recomendado para actualizar paquetes

1. Ejecuta localmente para ver paquetes desactualizados:

```powershell
dotnet list src --outdated
```

2. Actualiza la versión en `Directory.Packages.props` (un solo lugar).
3. Ejecuta:

```powershell
dotnet restore
dotnet build
dotnet test
```

4. Crea un PR con el cambio en `Directory.Packages.props`. Incluye en la descripción:
   - Paquetes actualizados y versiones nuevas.
   - Resultados de `dotnet build` y pruebas locales.
   - Riesgos o notas de compatibilidad (p. ej. cambios mayores de EF, breaking changes).

5. Revisa en CI/PR que la solución compila y los tests pasan antes de mergear.

## Buenas prácticas

- Evitar anular versiones por proyecto salvo necesidad crítica.
- Agrupar actualizaciones relacionadas (ej.: EF Core + proveedor MySQL) en el mismo PR.
- Hacer una actualización de paquete mayor en una rama separada y con revisión cuidadosa.
- Documentar incompatibilidades conocidas en el PR.

## Comandos útiles

- Restaurar dependencias:

```powershell
dotnet restore
```

- Compilar solución:

```powershell
dotnet build
```

- Ver paquetes desactualizados (en la raíz del repo o especificando carpeta):

```powershell
dotnet list . --outdated
```

## Contacto / aprobaciones

Para actualizaciones mayores (major) pedir revisión de alguno de los mantenedores del backend (mencionar en el PR). Para cambios menores y parches, una revisión estándar es suficiente.

---
Archivo generado automáticamente para guiar al equipo sobre la política de versiones centralizada.
