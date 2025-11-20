using System;
using System.Collections.Generic;

namespace Votapp.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public bool Activo { get; set; } = true;

        // Navegación
        public ICollection<Votacion>? VotacionesCreadas { get; set; } = new List<Votacion>();
        public ICollection<Voto>? VotosEmitidos { get; set; } = new List<Voto>();
        public ICollection<Participacion>? Participaciones { get; set; } = new List<Participacion>();
    }
}
