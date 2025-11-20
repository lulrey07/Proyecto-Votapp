using System;
using Votapp.Domain.Enums;

namespace Votapp.Domain.Entities
{
    public class Participacion
    {
        public Guid Id { get; set; }
        public Guid UsuarioId { get; set; }
        public Guid VotacionId { get; set; }
        public RoleUsuario Rol { get; set; }
        public DateTime FechaUnion { get; set; } = DateTime.UtcNow;

        // Navegación
        public User? Usuario { get; set; }
        public Votacion? Votacion { get; set; }
    }
}
