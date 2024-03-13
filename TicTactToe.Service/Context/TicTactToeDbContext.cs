
using Microsoft.EntityFrameworkCore;
using TicTactToe.Service.Models;

namespace TicTactToe.Service.Context;

public class TicTactToeDbContext : DbContext
{
    public TicTactToeDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("users");
    }

}