using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_DataAccess.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [StringLength(50)]
        public string LastName { get; set; } = null!;

        [StringLength(50)]
        public string Email { get; set; } = null!;

        [StringLength(15)]
        public string Phone { get; set; } = null!;

        [StringLength(150)]
        public string Street { get; set; } = null!;

        [StringLength(20)]
        public string? City { get; set; }

        [StringLength(20)]
        public string? State { get; set; }

        [StringLength(25)]
        public string UserName { get; set; } = null!;

        [StringLength(25)]
        public string Password { get; set; } = null!;

        public bool IsDeleted { get; set; }

        public AspNetRole Role { get; set; }
        [ForeignKey("Role")]
        public int RoleId { get; set; }
    }
}
