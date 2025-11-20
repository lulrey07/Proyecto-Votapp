using System;

namespace Votapp.Application.DTOs.User
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
    }
}
