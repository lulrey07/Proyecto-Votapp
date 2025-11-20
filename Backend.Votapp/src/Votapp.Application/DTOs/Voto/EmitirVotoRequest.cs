using System;

namespace Votapp.Application.DTOs.Voto
{
    public class EmitirVotoRequest
    {
        public string CodigoAcceso { get; set; } = string.Empty;
        public Guid OpcionSeleccionadaId { get; set; }
    }
}
