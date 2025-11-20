using System.Threading.Tasks;
using Votapp.Domain.Interfaces;

namespace Votapp.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly VotappDbContext _context;

        private IUserRepository? _userRepository;
        private IVotacionRepository? _votacionRepository;
        private IVotoRepository? _votoRepository;
        private IParticipacionRepository? _participacionRepository;

        public UnitOfWork(VotappDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users => _userRepository!;
        public IVotacionRepository Votaciones => _votacionRepository!;
        public IVotoRepository Votos => _votoRepository!;
        public IParticipacionRepository Participaciones => _participacionRepository!;

        public Task BeginTransactionAsync()
        {
            return _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task RollbackAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
