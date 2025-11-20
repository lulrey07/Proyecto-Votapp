using System;

namespace Votapp.Domain.Entities
{
    public class Voto
    {
        public Guid Id { get; set; }
        public Guid VotacionId { get; set; }
        public Guid UsuarioId { get; set; }
        public Guid OpcionSeleccionadaId { get; set; }
        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        // Navegación
        public Votacion? Votacion { get; set; }
        public User? Usuario { get; set; }
        public VotacionOpcion? OpcionSeleccionada { get; set; }
    }
}
