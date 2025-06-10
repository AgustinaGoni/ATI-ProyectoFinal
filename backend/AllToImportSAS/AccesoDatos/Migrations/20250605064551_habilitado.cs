using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccesoDatos.Migrations
{
    /// <inheritdoc />
    public partial class habilitado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Direcciones_DireccionId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_DireccionId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "DireccionId",
                table: "Usuarios");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "DocumentoIdentidad",
                table: "Usuarios",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "CostoEnvio",
                table: "TipoEntregas",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DatosNegocioId",
                table: "TipoEntregas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Habilitado",
                table: "Productos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Comentario",
                table: "Direcciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NroApartamento",
                table: "Direcciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstadoCompra",
                table: "Compras",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "PaymentId",
                table: "Compras",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "RazonSocial",
                table: "Compras",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Rut",
                table: "Compras",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Compras",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CostoDeEnvioDomicilio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnvioMontevideo = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostoDeEnvioDomicilio", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DatosNegocios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DireccionId = table.Column<int>(type: "int", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Horario = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatosNegocios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DatosNegocios_Direcciones_DireccionId",
                        column: x => x.DireccionId,
                        principalTable: "Direcciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogsWebhook",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Mensaje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoEvento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogsWebhook", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_DocumentoIdentidad",
                table: "Usuarios",
                column: "DocumentoIdentidad",
                unique: true,
                filter: "[DocumentoIdentidad] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TipoEntregas_DatosNegocioId",
                table: "TipoEntregas",
                column: "DatosNegocioId");

            migrationBuilder.CreateIndex(
                name: "IX_DatosNegocios_DireccionId",
                table: "DatosNegocios",
                column: "DireccionId");

            migrationBuilder.AddForeignKey(
                name: "FK_TipoEntregas_DatosNegocios_DatosNegocioId",
                table: "TipoEntregas",
                column: "DatosNegocioId",
                principalTable: "DatosNegocios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TipoEntregas_DatosNegocios_DatosNegocioId",
                table: "TipoEntregas");

            migrationBuilder.DropTable(
                name: "CostoDeEnvioDomicilio");

            migrationBuilder.DropTable(
                name: "DatosNegocios");

            migrationBuilder.DropTable(
                name: "LogsWebhook");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_DocumentoIdentidad",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_TipoEntregas_DatosNegocioId",
                table: "TipoEntregas");

            migrationBuilder.DropColumn(
                name: "DocumentoIdentidad",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "CostoEnvio",
                table: "TipoEntregas");

            migrationBuilder.DropColumn(
                name: "DatosNegocioId",
                table: "TipoEntregas");

            migrationBuilder.DropColumn(
                name: "Habilitado",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "Comentario",
                table: "Direcciones");

            migrationBuilder.DropColumn(
                name: "NroApartamento",
                table: "Direcciones");

            migrationBuilder.DropColumn(
                name: "EstadoCompra",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "RazonSocial",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "Rut",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Compras");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "DireccionId",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_DireccionId",
                table: "Usuarios",
                column: "DireccionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Direcciones_DireccionId",
                table: "Usuarios",
                column: "DireccionId",
                principalTable: "Direcciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
