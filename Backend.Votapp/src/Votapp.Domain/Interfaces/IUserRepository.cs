using System.Threading.Tasks;
using Votapp.Domain.Entities;

namespace Votapp.Domain.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
    }
}
