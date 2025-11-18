using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models; 

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURACIÓN DE CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin() 
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                      });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = 
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- CRÍTICO: CONEXIÓN A SQLITE LOCAL DE VUELTA ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ecommerce.db")); 
// --- FIN CONEXIÓN A SQLITE ---


var app = builder.Build();

// --- BLOQUE CRÍTICO: RECONSTRUCCIÓN DE BASE DE DATOS GARANTIZADA ---
// Obliga a que la BD se cree con los datos de AppDbContext.cs
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    context.Database.EnsureDeleted(); // 1. Elimina el archivo .db viejo
    context.Database.EnsureCreated(); // 2. Crea el archivo .db con los datos de muestra
}
// --- FIN BLOQUE CRÍTICO ---


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseCors(MyAllowSpecificOrigins);
app.MapControllers();

app.Run();