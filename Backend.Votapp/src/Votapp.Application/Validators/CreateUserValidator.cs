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
