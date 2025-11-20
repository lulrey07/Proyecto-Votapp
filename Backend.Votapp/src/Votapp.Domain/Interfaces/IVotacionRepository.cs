using System.Collections.Generic;
using System.Threading.Tasks;
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IVotacionRepository : IRepository<Votacion>
    {
        Task<Votacion?> GetByCodigoAccesoAsync(string codigo);
        Task<IEnumerable<Votacion>> GetByCreadorAsync(System.Guid creadorId);
        Task<bool> CodigoAccesoExistsAsync(string codigo);
        Task<Votacion?> GetWithOpcionsAsync(System.Guid id);
    }
}
