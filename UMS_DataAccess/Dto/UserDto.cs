using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_DataAccess.Dto
{
    public class UserDto
    {
        [Required]
        [StringLength(20, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 2)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("^[0-9]{10}$", ErrorMessage = "Phone number must be 10 digits")]
        public string Phone { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 2)]
        public string Street { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 5)]
        public string UserName { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\-]).{6,16}$", ErrorMessage = "Password must be 6-16 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character")]
        public string Password { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}
