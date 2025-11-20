using System;
using System.Collections.Generic;

namespace Votapp.Domain.Entities
{
    public class VotacionOpcion
    {
        public Guid Id { get; set; }
        public Guid VotacionId { get; set; }
        public string Texto { get; set; } = string.Empty;
        public int Orden { get; set; }

        // Navegación
        public Votacion? Votacion { get; set; }
        public ICollection<Voto>? VotosRecibidos { get; set; } = new List<Voto>();
    }
}
