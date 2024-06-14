using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_DataAccess.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        public DbSet<AspNetRole> AspNetRoles { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            modelBuilder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();
            modelBuilder.Entity<AspNetRole>().HasData(
                new AspNetRole { Id = 1, Role = "Admin" },
                new AspNetRole { Id = 2, Role = "User" }
            );

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "Tatvasoft",
                    Email = "admin@gmail.com",
                    Phone = "8523698523",
                    Street = "Rajpath club Road",
                    City = "Ahmedabad",
                    State = "Gujarat",
                    UserName = "Admin123",
                    Password = "Admin@123",
                    IsDeleted = false,
                    RoleId = 1 
                },
                new User
                {
                    Id=2,
                    FirstName = "User",
                    LastName = "Tatvasoft",
                    Email = "user@gmail.com",
                    Phone = "9876543210",
                    Street = "Rajpath Club Road",
                    City = "Ahmedabad",
                    State = "Gujarat",
                    UserName = "User123",
                    Password = "User@123",
                    IsDeleted = false,
                    RoleId = 2 
                }
            );
        }


    }
}
