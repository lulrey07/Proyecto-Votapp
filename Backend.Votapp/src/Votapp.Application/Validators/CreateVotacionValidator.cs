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
                .Must(o => o != null && o.Count >= 2).WithMessage("Debe haber al menos 2 opciones");

            RuleFor(x => x.FechaInicio)
                .LessThan(x => x.FechaCierre).WithMessage("Fecha inicio debe ser menor a fecha cierre");

            RuleFor(x => x.FechaCierre)
                .GreaterThan(x => x.FechaInicio).WithMessage("Fecha cierre debe ser mayor a fecha inicio");
        }
    }
}
