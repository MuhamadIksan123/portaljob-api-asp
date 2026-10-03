using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Controllers;

public class CategoriesController(StoreContext context, ImageService imageService) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var categories = await context.Categories
            .Where(x => x.DeletedAt == null)
            .OrderByDescending(x => x.Id)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                IconUrl = x.IconUrl,
                Slug = x.Slug,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return categories;
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await context.Categories
            .Where(x => x.Id == id && x.DeletedAt == null)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                IconUrl = x.IconUrl,
                Slug = x.Slug,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (category == null) return NotFound();

        return category;
    }

    [Authorize(Roles = "super_admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromForm] CreateCategoryDto categoryDto)
    {
        if (await context.Categories.AnyAsync(x => x.Name == categoryDto.Name && x.DeletedAt == null))
            return BadRequest("Category name already exists");

        if (categoryDto.Icon == null)
            return BadRequest("Icon is required");

        var imageResult = await imageService.AddImageAsync(categoryDto.Icon);

        if (imageResult.Error != null)
            return BadRequest(imageResult.Error.Message);

        var category = new Category
        {
            Name = categoryDto.Name,
            Slug = ToSlug(categoryDto.Name),
            IconUrl = imageResult.SecureUrl.AbsoluteUri,
            IconPublicId = imageResult.PublicId
        };

        context.Categories.Add(category);

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                IconUrl = category.IconUrl,
                Slug = category.Slug,
                CreatedAt = category.CreatedAt
            });
        }

        return BadRequest("Problem creating new category");
    }

    [Authorize(Roles = "super_admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCategory(int id, [FromForm] UpdateCategoryDto categoryDto)
    {
        var category = await context.Categories
            .FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);

        if (category == null) return NotFound();

        if (await context.Categories.AnyAsync(x => x.Id != id && x.Name == categoryDto.Name && x.DeletedAt == null))
            return BadRequest("Category name already exists");

        var oldPublicId = category.IconPublicId;

        category.Name = categoryDto.Name;
        category.Slug = ToSlug(categoryDto.Name);
        category.UpdatedAt = DateTime.UtcNow;

        if (categoryDto.Icon != null)
        {
            var imageResult = await imageService.AddImageAsync(categoryDto.Icon);

            if (imageResult.Error != null)
                return BadRequest(imageResult.Error.Message);

            category.IconUrl = imageResult.SecureUrl.AbsoluteUri;
            category.IconPublicId = imageResult.PublicId;
        }

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            if (categoryDto.Icon != null && !string.IsNullOrEmpty(oldPublicId))
                await imageService.DeleteImageAsync(oldPublicId);

            return NoContent();
        }

        return BadRequest("Problem updating category");
    }

    [Authorize(Roles = "super_admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var category = await context.Categories
            .FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null);

        if (category == null) return NotFound();

        category.DeletedAt = DateTime.UtcNow;
        category.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            if (!string.IsNullOrEmpty(category.IconPublicId))
                await imageService.DeleteImageAsync(category.IconPublicId);

            return NoContent();
        }

        return BadRequest("Problem deleting category");
    }

    private static string ToSlug(string value)
    {
        var slug = Regex.Replace(value.ToLowerInvariant().Trim(), "[^a-z0-9]+", "-");
        return slug.Trim('-');
    }
}