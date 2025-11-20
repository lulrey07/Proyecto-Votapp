using System.Collections.Generic;
using System.Threading.Tasks;
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IVotoRepository : IRepository<Voto>
    {
        Task<bool> UsuarioYaVotoAsync(System.Guid votacionId, System.Guid usuarioId);
        Task<IEnumerable<Voto>> GetByVotacionAsync(System.Guid votacionId);
        Task<int> ContarVotosPorOpcionAsync(System.Guid opcionId);
    }
}
