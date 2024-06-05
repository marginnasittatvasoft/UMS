using Microsoft.EntityFrameworkCore;
using UMS_DataAccess.Models;

namespace UMS_API.Extensions
{
    public static class MigrationManager
    {
        public static WebApplication MigrateDatabase(this WebApplication webApp)
        {
            using (var scope = webApp.Services.CreateScope())
            {

                try
                {
                    var appContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    if (appContext.Database.GetPendingMigrations().Count() > 0)
                    {
                        appContext.Database.Migrate();
                    }

                }
                catch (Exception ex)
                {

                    throw;
                }

            }
            return webApp;
        }
    }
}
