using AutoMapper;
using EMS.API.Profiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System.IO;
using System.Text;
using UMS_API.Extensions;
using UMS_API.Middleware;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Repositories.Repos;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_BusinessLogic.Services.Repos;
using UMS_DataAccess.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("UmsConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAspNetRoleRepository, AspNetRoleRepository>();
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));



Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Error() 
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Error)
        .WriteTo.File(GetLogFilePath(), rollingInterval: RollingInterval.Day))
    .CreateLogger();

string GetLogFilePath()
{
    string logFolder = Path.Combine("Log", DateTime.Now.Year.ToString(), DateTime.Now.ToString("MMM"));
    Directory.CreateDirectory(logFolder);
    string logFileName = DateTime.Now.ToString("dd") + "logfile" + ".txt";
    return Path.Combine(logFolder, logFileName);
}


var secret = builder.Configuration["Jwt:Key"];
var key = Encoding.ASCII.GetBytes(secret)

;
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)

,
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Host.UseSerilog();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowAnyOrigin();
});

app.UseAuthorization();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapControllers();

app.MigrateDatabase();

app.Run();
