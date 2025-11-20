using System;
using System.Collections.Generic;

namespace Votapp.Application.DTOs.Votacion
{
    public class VotacionResponse
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string CodigoAcceso { get; set; } = string.Empty;
        public List<OpcionResponse> Opciones { get; set; } = new();
    }

    public class OpcionResponse
    {
        public Guid Id { get; set; }
        public string Texto { get; set; } = string.Empty;
        public int VotosRecibidos { get; set; }
    }
}
