using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // 1. Jalankan migrasi database
        await context.Database.MigrateAsync();

        // 2. Buat Roles terlebih dahulu
        var roles = new[] { "employee", "employer", "super_admin" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 3. Buat Users terlebih dahulu agar data relasi (seperti EmployerId) tersedia
        await CreateUser(userManager, "superadmin@gmail.com", "Super Admin", "Superadmin", 100, "admin123", "super_admin");
        await CreateUser(userManager, "employer@test.com", "Budi Employer", "HR Manager", 5, "Pa$$w0rd", "employer");
        await CreateUser(userManager, "employee@test.com", "Andi Employee", ".NET Developer", 2, "Pa$$w0rd", "employee");

        // 4. Inisialisasi Categories (jika belum ada)
        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category
                {
                    Name = "Software Engineering",
                    Slug = "software-engineering",
                    IconUrl = "https://picsum.photos/seed/software-engineering/200/200",
                    IconPublicId = string.Empty
                },
                new Category
                {
                    Name = "UI/UX Design",
                    Slug = "ui-ux-design",
                    IconUrl = "https://picsum.photos/seed/ui-ux-design/200/200",
                    IconPublicId = string.Empty
                },
                new Category
                {
                    Name = "Data Science",
                    Slug = "data-science",
                    IconUrl = "https://picsum.photos/seed/data-science/200/200",
                    IconPublicId = string.Empty
                },
                new Category
                {
                    Name = "Product Management",
                    Slug = "product-management",
                    IconUrl = "https://picsum.photos/seed/product-management/200/200",
                    IconPublicId = string.Empty
                },
                new Category
                {
                    Name = "Digital Marketing",
                    Slug = "digital-marketing",
                    IconUrl = "https://picsum.photos/seed/digital-marketing/200/200",
                    IconPublicId = string.Empty
                }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // 5. Inisialisasi Companies (jika belum ada)
        if (!await context.Companies.AnyAsync())
        {
            var employer = await userManager.FindByEmailAsync("employer@test.com");

            if (employer != null)
            {
                var companies = new List<Company>
                {
                    new Company
                    {
                        Name = "PT Maju Bersama",
                        Slug = "pt-maju-bersama",
                        LogoUrl = "https://picsum.photos/seed/maju-bersama/200/200",
                        LogoPublicId = string.Empty,
                        About = "Perusahaan teknologi yang bergerak di bidang software development.",
                        EmployerId = employer.Id
                    }
                };

                context.Companies.AddRange(companies);
                await context.SaveChangesAsync();
            }
        }

        // Seed Company Jobs
        if (!await context.CompanyJobs.AnyAsync())
        {
            var company = await context.Companies
                .FirstOrDefaultAsync(x => x.Name == "PT Digital Nusantara");

            var category = await context.Categories
                .FirstOrDefaultAsync(x => x.Slug == "digital-marketing-update");

            Console.WriteLine($"Company: {company?.Name}");
            Console.WriteLine($"Category: {category?.Name}");

            if (company != null && category != null)
            {
                var jobs = new List<CompanyJob>
        {
            new CompanyJob
            {
                Name = "Junior .NET Developer",
                Slug = "junior-net-developer",
                Type = "Full Time",
                Location = "Jakarta",
                SkillLevel = "Junior",
                Salary = 7000000,
                ThumbnailUrl = "https://picsum.photos/seed/junior-net-developer/800/600",
                ThumbnailPublicId = string.Empty,
                About = "Kami sedang mencari Junior .NET Developer untuk bergabung dengan tim development.",
                IsOpen = true,
                CompanyId = company.Id,
                CategoryId = category.Id,

                Responsibilities = new List<JobResponsibility>
                {
                    new JobResponsibility
                    {
                        Name = "Mengembangkan aplikasi menggunakan ASP.NET Core"
                    },
                    new JobResponsibility
                    {
                        Name = "Melakukan debugging dan memperbaiki bug"
                    },
                    new JobResponsibility
                    {
                        Name = "Bekerja sama dengan tim developer"
                    }
                },

                Qualifications = new List<JobQualification>
                {
                    new JobQualification
                    {
                        Name = "Memahami C# dan .NET"
                    },
                    new JobQualification
                    {
                        Name = "Memahami SQL Server"
                    },
                    new JobQualification
                    {
                        Name = "Memahami REST API"
                    }
                }
            },

            new CompanyJob
            {
                Name = "Backend .NET Developer",
                Slug = "backend-net-developer",
                Type = "Full Time",
                Location = "Jakarta",
                SkillLevel = "Intermediate",
                Salary = 10000000,
                ThumbnailUrl = "https://picsum.photos/seed/backend-net-developer/800/600",
                ThumbnailPublicId = string.Empty,
                About = "Bergabung dengan tim backend untuk mengembangkan aplikasi dan REST API.",
                IsOpen = true,
                CompanyId = company.Id,
                CategoryId = category.Id,

                Responsibilities = new List<JobResponsibility>
                {
                    new JobResponsibility
                    {
                        Name = "Mengembangkan REST API menggunakan ASP.NET Core"
                    },
                    new JobResponsibility
                    {
                        Name = "Mendesain dan mengoptimalkan database"
                    },
                    new JobResponsibility
                    {
                        Name = "Melakukan code review"
                    }
                },

                Qualifications = new List<JobQualification>
                {
                    new JobQualification
                    {
                        Name = "Minimal 2 tahun pengalaman menggunakan .NET"
                    },
                    new JobQualification
                    {
                        Name = "Menguasai C# dan ASP.NET Core"
                    },
                    new JobQualification
                    {
                        Name = "Menguasai Entity Framework Core"
                    }
                }
            },

            new CompanyJob
            {
                Name = "Full Stack Developer",
                Slug = "full-stack-developer",
                Type = "Full Time",
                Location = "Bandung",
                SkillLevel = "Intermediate",
                Salary = 9000000,
                ThumbnailUrl = "https://picsum.photos/seed/full-stack-developer/800/600",
                ThumbnailPublicId = string.Empty,
                About = "Mengembangkan aplikasi web dari sisi backend dan frontend.",
                IsOpen = true,
                CompanyId = company.Id,
                CategoryId = category.Id,

                Responsibilities = new List<JobResponsibility>
                {
                    new JobResponsibility
                    {
                        Name = "Mengembangkan fitur backend dan frontend"
                    },
                    new JobResponsibility
                    {
                        Name = "Membuat dan menggunakan REST API"
                    },
                    new JobResponsibility
                    {
                        Name = "Melakukan testing aplikasi"
                    }
                },

                Qualifications = new List<JobQualification>
                {
                    new JobQualification
                    {
                        Name = "Menguasai C# dan JavaScript"
                    },
                    new JobQualification
                    {
                        Name = "Memahami ASP.NET Core"
                    },
                    new JobQualification
                    {
                        Name = "Memahami React"
                    }
                }
            }
        };

                context.CompanyJobs.AddRange(jobs);
                await context.SaveChangesAsync();
            }
        }

        // Seed Job Candidates
        var employee = await userManager.FindByEmailAsync("employee@test.com");

        var juniorJob = await context.CompanyJobs
            .FirstOrDefaultAsync(x => x.Slug == "junior-net-developer");

        var backendJob = await context.CompanyJobs
            .FirstOrDefaultAsync(x => x.Slug == "backend-net-developer");

        var fullstackJob = await context.CompanyJobs
            .FirstOrDefaultAsync(x => x.Slug == "full-stack-developer");

        if (employee != null)
        {
            var candidates = new List<JobCandidate>();

            if (juniorJob != null)
            {
                var exists = await context.JobCandidates
                    .AnyAsync(x =>
                        x.CandidateId == employee.Id &&
                        x.CompanyJobId == juniorJob.Id);

                if (!exists)
                {
                    candidates.Add(new JobCandidate
                    {
                        CandidateId = employee.Id,
                        CompanyJobId = juniorJob.Id,
                        ResumeUrl = string.Empty,
                        ResumePublicId = string.Empty,
                        Message = "Saya tertarik dengan posisi Junior .NET Developer.",
                        IsHired = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (backendJob != null)
            {
                var exists = await context.JobCandidates
                    .AnyAsync(x =>
                        x.CandidateId == employee.Id &&
                        x.CompanyJobId == backendJob.Id);

                if (!exists)
                {
                    candidates.Add(new JobCandidate
                    {
                        CandidateId = employee.Id,
                        CompanyJobId = backendJob.Id,
                        ResumeUrl = string.Empty,
                        ResumePublicId = string.Empty,
                        Message = "Saya tertarik dengan posisi Backend .NET Developer.",
                        IsHired = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (fullstackJob != null)
            {
                var exists = await context.JobCandidates
                    .AnyAsync(x =>
                        x.CandidateId == employee.Id &&
                        x.CompanyJobId == fullstackJob.Id);

                if (!exists)
                {
                    candidates.Add(new JobCandidate
                    {
                        CandidateId = employee.Id,
                        CompanyJobId = fullstackJob.Id,
                        ResumeUrl = string.Empty,
                        ResumePublicId = string.Empty,
                        Message = "Saya tertarik dengan posisi Full Stack Developer.",
                        IsHired = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (candidates.Count > 0)
            {
                context.JobCandidates.AddRange(candidates);
                await context.SaveChangesAsync();
            }
        }
    }

    private static async Task CreateUser(
        UserManager<User> userManager,
        string email,
        string name,
        string occupation,
        int experience,
        string password,
        string role)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user is not null)
            return;

        user = new User
        {
            UserName = email,
            Email = email,
            Name = name,
            Occupation = occupation,
            Experience = experience
        };

        var result = await userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join("; ", result.Errors.Select(x => x.Description)));
        }

        await userManager.AddToRoleAsync(user, role);
    }
}