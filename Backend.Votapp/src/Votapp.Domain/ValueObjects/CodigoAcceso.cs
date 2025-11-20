using System;
using System.Linq;

namespace Votapp.Domain.ValueObjects
{
    public class CodigoAcceso
    {
        public string Valor { get; private set; }

        private CodigoAcceso(string valor)
        {
            Valor = valor;
        }

        public static CodigoAcceso Generar()
        {
            const string caracteres = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
            var random = new Random();
            var codigo = new string(Enumerable.Range(0, 6)
                .Select(_ => caracteres[random.Next(caracteres.Length)])
                .ToArray());

            return new CodigoAcceso(codigo);
        }

        public static CodigoAcceso Crear(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor) || valor.Length != 6)
                throw new ArgumentException("Código debe tener 6 caracteres");

            return new CodigoAcceso(valor.ToUpper());
        }
    }
}
