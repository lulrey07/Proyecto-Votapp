using System;
using System.Threading.Tasks;

namespace Votapp.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IVotacionRepository Votaciones { get; }
        IVotoRepository Votos { get; }
        IParticipacionRepository Participaciones { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
