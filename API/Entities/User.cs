using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public string? Occupation { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? AvatarPublicId { get; set; }
        public int Experience { get; set; }
    }
}