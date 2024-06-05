using AutoMapper;
using EMS.API.Profiles;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using System.IO;
using UMS_API.Extensions;
using UMS_BusinessLogic.Repositories;
using UMS_BusinessLogic.Services;
using UMS_DataAccess.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("UmsConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepositories, UserRepositories>();

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Error() 
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Error)
        .WriteTo.File(GetLogFilePath(), rollingInterval: RollingInterval.Day))
    .CreateLogger();

string GetLogFilePath()
{
    string logFolder = Path.Combine("Log", DateTime.Now.Year.ToString(), DateTime.Now.ToString("MM"));
    Directory.CreateDirectory(logFolder);
    string logFileName = DateTime.Now.ToString("dd") + "logfile" + ".txt";
    return Path.Combine(logFolder, logFileName);
}

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

app.MapControllers();

app.MigrateDatabase();

app.Run();
