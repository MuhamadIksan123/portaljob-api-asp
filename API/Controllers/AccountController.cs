using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ImageService imageService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromForm] RegisterDto dto)
        {
            var user = new User
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name = dto.Name,
                Occupation = dto.Occupation,
                Experience = dto.Experience
            };

            if (dto.Avatar is not null)
            {
                var upload = await imageService.AddImageAsync(dto.Avatar, "jobportal/avatars");
                // Pastikan hasil upload tidak error
                if (upload is not null && upload.Error is null)
                {
                    user.AvatarUrl = upload.Url.ToString(); // Ubah Uri menjadi string
                    user.AvatarPublicId = upload.PublicId;
                }
                else
                {
                    ModelState.AddModelError("Avatar", upload?.Error?.Message ?? "Gagal mengunggah gambar ke Cloudinary.");
                    return ValidationProblem();
                }
            }

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                    ModelState.AddModelError(error.Code, error.Description);
                return ValidationProblem();
            }

            var role = dto.AccountType switch
            {
                "employer" => "employer",
                "super_admin" => "super_admin",
                _ => "employee"
            };

            await userManager.AddToRoleAsync(user, role);

            return Ok();
        }

        [Authorize]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var roles = await userManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.UserName,
                user.Name,
                user.AvatarUrl,
                user.Occupation,
                user.Experience,
                Roles = roles
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }
    }
}