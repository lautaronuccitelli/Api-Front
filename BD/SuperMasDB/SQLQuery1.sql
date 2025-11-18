CREATE TABLE Cliente (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100),
    Apellido NVARCHAR(100),
    Correo NVARCHAR(150),
    Zona NVARCHAR(100),
    Edad INT,
	Genero NVARCHAR(20)
);
GO

CREATE TABLE Producto (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Categoria NVARCHAR(100) NOT NULL,
    Precio FLOAT NOT NULL,
    Stock INT NOT NULL
);
GO

CREATE TABLE Venta (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATETIME NOT NULL,
    ClienteId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario FLOAT NOT NULL,
    MetodoPago NVARCHAR(50) NOT NULL,
    Total FLOAT NOT NULL,

    CONSTRAINT FK_Venta_Cliente FOREIGN KEY (ClienteId)
        REFERENCES Cliente(Id),

    CONSTRAINT FK_Venta_Producto FOREIGN KEY (ProductoId)
        REFERENCES Producto(Id)
);
GO
