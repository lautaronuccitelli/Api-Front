using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;

namespace EcommerceApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Venta> Ventas => Set<Venta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // CLIENTES DE MUESTRA
        modelBuilder.Entity<Cliente>().HasData(
            new Cliente { Id = 1, Nombre = "Juan", Apellido = "Perez", Correo = "juan.p@mail.com", Zona = "Norte", Edad = 30, Genero = "Masculino" },
            new Cliente { Id = 2, Nombre = "Maria", Apellido = "Gomez", Correo = "maria.g@mail.com", Zona = "Sur", Edad = 25, Genero = "Femenino" },
            new Cliente { Id = 3, Nombre = "Carlos", Apellido = "Lopez", Correo = "carlos.l@mail.com", Zona = "Este", Edad = 45, Genero = "Masculino" },
            new Cliente { Id = 4, Nombre = "Ana", Apellido = "Ruiz", Correo = "ana.r@mail.com", Zona = "Norte", Edad = 50, Genero = "Femenino" },
            new Cliente { Id = 5, Nombre = "Pedro", Apellido = "Diaz", Correo = "pedro.d@mail.com", Zona = "Oeste", Edad = 22, Genero = "Masculino" }
        );

        // PRODUCTOS DE MUESTRA
        modelBuilder.Entity<Producto>().HasData(
            new Producto { Id = 101, Nombre = "Teclado Mecanico", Categoria = "Electronica", Precio = 50.00, Stock = 150 },
            new Producto { Id = 102, Nombre = "Mouse Inalambrico", Categoria = "Electronica", Precio = 25.50, Stock = 200 },
            new Producto { Id = 103, Nombre = "Camiseta Algodon", Categoria = "Ropa", Precio = 15.00, Stock = 300 },
            new Producto { Id = 104, Nombre = "Jeans Casual", Categoria = "Ropa", Precio = 40.00, Stock = 100 },
            new Producto { Id = 105, Nombre = "Monitor 4K", Categoria = "Electronica", Precio = 350.00, Stock = 50 }
        );

        // VENTAS DE MUESTRA
        modelBuilder.Entity<Venta>().HasData(
            new Venta { Id = 1, ClienteId = 1, ProductoId = 101, Cantidad = 2, PrecioUnitario = 50.00, MetodoPago = "TC", Total = 100.00, Fecha = DateTime.Now.AddDays(-5) },
            new Venta { Id = 2, ClienteId = 3, ProductoId = 103, Cantidad = 5, PrecioUnitario = 15.00, MetodoPago = "Efectivo", Total = 75.00, Fecha = DateTime.Now.AddDays(-4) },
            new Venta { Id = 3, ClienteId = 4, ProductoId = 102, Cantidad = 1, PrecioUnitario = 25.50, MetodoPago = "TD", Total = 25.50, Fecha = DateTime.Now.AddDays(-3) },
            new Venta { Id = 4, ClienteId = 1, ProductoId = 105, Cantidad = 1, PrecioUnitario = 350.00, MetodoPago = "TC", Total = 350.00, Fecha = DateTime.Now.AddDays(-2) },
            new Venta { Id = 5, ClienteId = 2, ProductoId = 104, Cantidad = 3, PrecioUnitario = 40.00, MetodoPago = "QR", Total = 120.00, Fecha = DateTime.Now.AddDays(-1) },
            new Venta { Id = 6, ClienteId = 5, ProductoId = 101, Cantidad = 1, PrecioUnitario = 50.00, MetodoPago = "Efectivo", Total = 50.00, Fecha = DateTime.Now }
        );

        base.OnModelCreating(modelBuilder);
    }
}