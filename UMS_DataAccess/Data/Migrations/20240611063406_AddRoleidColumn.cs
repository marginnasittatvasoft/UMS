using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UMS_DataAccess.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleidColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Users");
        }
    }
}
