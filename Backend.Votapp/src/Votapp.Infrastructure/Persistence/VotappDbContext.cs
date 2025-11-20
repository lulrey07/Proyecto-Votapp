using Microsoft.EntityFrameworkCore;
using Votapp.Domain.Entities;

namespace Votapp.Infrastructure.Persistence
{
    public class VotappDbContext : DbContext
    {
        public VotappDbContext(DbContextOptions<VotappDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Votacion> Votaciones { get; set; } = null!;
        public DbSet<VotacionOpcion> VotacionOpciones { get; set; } = null!;
        public DbSet<Voto> Votos { get; set; } = null!;
        public DbSet<Participacion> Participaciones { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired();
            });

            modelBuilder.Entity<Votacion>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.CodigoAcceso).IsUnique();
                entity.Property(e => e.Titulo).IsRequired();
            });

            modelBuilder.Entity<VotacionOpcion>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Votacion)
                    .WithMany(v => v.Opciones)
                    .HasForeignKey(e => e.VotacionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Voto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Votacion)
                    .WithMany(v => v.Votos)
                    .HasForeignKey(e => e.VotacionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.VotosEmitidos)
                    .HasForeignKey(e => e.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);

                // RN-02: Un voto por usuario por votación
                entity.HasIndex(e => new { e.VotacionId, e.UsuarioId }).IsUnique();
            });

            modelBuilder.Entity<Participacion>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.Participaciones)
                    .HasForeignKey(e => e.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Votacion)
                    .WithMany(v => v.Participaciones)
                    .HasForeignKey(e => e.VotacionId)
                    .OnDelete(DeleteBehavior.Cascade);

                // RN-01: Un rol por usuario por votación
                entity.HasIndex(e => new { e.UsuarioId, e.VotacionId }).IsUnique();
            });
        }
    }
}
