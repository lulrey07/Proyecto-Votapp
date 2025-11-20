using System;
using System.Collections.Generic;
using Votapp.Domain.Enums;

namespace Votapp.Domain.Entities
{
    public class Votacion
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public EstadoVotacion Estado { get; set; } = EstadoVotacion.Paused;
        public string CodigoAcceso { get; set; } = string.Empty; // 6 caracteres
        public Guid CreadorId { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Navegación
        public User? Creador { get; set; }
        public ICollection<VotacionOpcion>? Opciones { get; set; } = new List<VotacionOpcion>();
        public ICollection<Voto>? Votos { get; set; } = new List<Voto>();
        public ICollection<Participacion>? Participaciones { get; set; } = new List<Participacion>();
    }
}
