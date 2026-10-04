using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ContactsController(StoreContext context) : BaseApiController
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult> Create(ContactDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is required.");

        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest("Email is required.");

        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Message is required.");

        context.Contacts.Add(new Contact
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Message = dto.Message.Trim()
        });

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem sending contact message.");

        return NoContent();
    }

    [Authorize(Roles = "super_admin")]
    [HttpGet]
    public async Task<ActionResult<List<ContactAdminDto>>> GetContacts()
    {
        return await context.Contacts
            .OrderByDescending(x => x.Id)
            .Select(x => new ContactAdminDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Message = x.Message,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    [Authorize(Roles = "super_admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteContact(int id)
    {
        var contact = await context.Contacts.FindAsync(id);

        if (contact is null)
            return NotFound();

        context.Contacts.Remove(contact);

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem deleting contact.");

        return NoContent();
    }
}