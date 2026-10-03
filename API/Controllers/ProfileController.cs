using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class ProfileController(
    StoreContext context,
    UserManager<User> userManager,
    ImageService imageService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult> GetProfile()
    {
        var user = await userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.AvatarUrl,
            user.Occupation,
            user.Experience,
            Roles = await userManager.GetRolesAsync(user)
        });
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProfile(
        [FromForm] UpdateProfileDto dto)
    {
        var user = await userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        user.Name = dto.Name;
        user.Occupation = dto.Occupation;
        user.Experience = dto.Experience;

        if (!string.Equals(
            user.Email,
            dto.Email,
            StringComparison.OrdinalIgnoreCase))
        {
            var result = await userManager.SetEmailAsync(user, dto.Email);

            if (!result.Succeeded)
                return ValidationProblem(ToModelState(result.Errors));

            user.UserName = dto.Email;
        }

        if (dto.Avatar is not null)
        {
            var oldPublicId = user.AvatarPublicId;
            var upload = await imageService.AddImageAsync(
                dto.Avatar, "jobportal/avatars");

            if (upload.Error is not null)
                return BadRequest(upload.Error.Message);

            user.AvatarUrl = upload.SecureUrl.AbsoluteUri;
            user.AvatarPublicId = upload.PublicId;

            if (!string.IsNullOrEmpty(oldPublicId))
                await imageService.DeleteImageAsync(oldPublicId);
        }

        var update = await userManager.UpdateAsync(user);

        if (!update.Succeeded)
            return ValidationProblem(ToModelState(update.Errors));

        return NoContent();
    }

    [HttpPut("password")]
    public async Task<ActionResult> ChangePassword(
        ChangePasswordDto dto)
    {
        var user = await userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        var result = await userManager.ChangePasswordAsync(
            user,
            dto.CurrentPassword,
            dto.NewPassword);

        if (!result.Succeeded)
            return ValidationProblem(ToModelState(result.Errors));

        return NoContent();
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteProfile(
        DeleteProfileDto dto)
    {
        var user = await userManager.GetUserAsync(User);

        if (user is null)
            return Unauthorized();

        if (!await userManager.CheckPasswordAsync(user, dto.Password))
            return BadRequest("Password is incorrect.");

        var applications = await context.JobCandidates
            .IgnoreQueryFilters()
            .Where(x => x.CandidateId == user.Id)
            .ToListAsync();

        foreach (var application in applications)
            application.DeletedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        if (!string.IsNullOrEmpty(user.AvatarPublicId))
            await imageService.DeleteImageAsync(user.AvatarPublicId);

        var result = await userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return ValidationProblem(ToModelState(result.Errors));

        return NoContent();
    }

    private static ModelStateDictionary ToModelState(
        IEnumerable<IdentityError> errors)
    {
        var modelState = new ModelStateDictionary();

        foreach (var error in errors)
            modelState.AddModelError(
                error.Code,
                error.Description);

        return modelState;
    }
}