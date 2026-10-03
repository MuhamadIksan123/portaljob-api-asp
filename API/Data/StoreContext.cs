using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions<StoreContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<CompanyJob> CompanyJobs => Set<CompanyJob>();
    public DbSet<JobResponsibility> JobResponsibilities => Set<JobResponsibility>();
    public DbSet<JobQualification> JobQualifications => Set<JobQualification>();
    public DbSet<JobCandidate> JobCandidates => Set<JobCandidate>();


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>().HasQueryFilter(x => x.DeletedAt == null);
        builder.Entity<Category>().HasIndex(x => x.Name).IsUnique().HasFilter("[DeletedAt] IS NULL");

        builder.Entity<Company>().HasQueryFilter(x => x.DeletedAt == null);
        builder.Entity<Company>().HasIndex(x => x.Name).IsUnique().HasFilter("[DeletedAt] IS NULL");

        builder.Entity<Company>()
            .HasOne(x => x.Employer)
            .WithMany()
            .HasForeignKey(x => x.EmployerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyJob>().HasQueryFilter(x => x.DeletedAt == null);
        builder.Entity<JobResponsibility>().HasQueryFilter(x => x.DeletedAt == null);
        builder.Entity<JobQualification>().HasQueryFilter(x => x.DeletedAt == null);

        builder.Entity<CompanyJob>()
            .HasOne(x => x.Company)
            .WithMany()
            .HasForeignKey(x => x.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CompanyJob>()
            .HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<JobResponsibility>()
            .HasOne(x => x.CompanyJob)
            .WithMany(x => x.Responsibilities)
            .HasForeignKey(x => x.CompanyJobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<JobQualification>()
            .HasOne(x => x.CompanyJob)
            .WithMany(x => x.Qualifications)
            .HasForeignKey(x => x.CompanyJobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<JobCandidate>()
        .HasOne(x => x.Candidate)
        .WithMany()
        .HasForeignKey(x => x.CandidateId)
        .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<JobCandidate>()
            .HasOne(x => x.Job)
            .WithMany()
            .HasForeignKey(x => x.CompanyJobId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}