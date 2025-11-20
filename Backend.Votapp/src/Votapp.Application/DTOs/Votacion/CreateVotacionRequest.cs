using System;
using System.Collections.Generic;

namespace Votapp.Application.DTOs.Votacion
{
    public class CreateVotacionRequest
    {
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaCierre { get; set; }
        public List<string> Opciones { get; set; } = new();
    }
}
