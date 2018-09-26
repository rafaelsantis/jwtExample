using System;
using System.ComponentModel.DataAnnotations;
namespace jwtApi.Models
{
    public class User
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        [Required]
        public UserLevels UserLevel { get; set; }

    }

    public enum UserLevels 
    {
        Atendente,
        Cliente        
    }
}