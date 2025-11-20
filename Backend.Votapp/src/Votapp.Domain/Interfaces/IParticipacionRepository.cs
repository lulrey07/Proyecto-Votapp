using System.Collections.Generic;
using System.Threading.Tasks;
using Votapp.Domain.Entities;
using Votapp.Domain.Enums;

namespace Votapp.Domain.Interfaces
{
    public interface IParticipacionRepository : IRepository<Participacion>
    {
        Task<Participacion?> GetByUserAndVotacionAsync(System.Guid usuarioId, System.Guid votacionId);
        Task<IEnumerable<Participacion>> GetByVotacionAsync(System.Guid votacionId);
        Task<RoleUsuario?> GetUserRoleInVotacionAsync(System.Guid usuarioId, System.Guid votacionId);
    }
}
