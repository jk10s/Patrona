-- Crear la base de datos
CREATE DATABASE discotelapatrona;

-- Usar la base de datos
USE discotelapatrona;

-- Crear la tabla Empleados
CREATE TABLE Empleados (
    IDEmpleado INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    TipoCuenta ENUM('administrador','empleado') NOT NULL,
    EsAdministrador TINYINT(1) NOT NULL DEFAULT 0
);

-- Crear la tabla InventarioProductos
CREATE TABLE InventarioProductos (
    IDProducto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreProducto VARCHAR(100) NOT NULL,
    PrecioCompra DECIMAL(10,2) NOT NULL,
    PrecioProducto DECIMAL(10,2) NOT NULL,
    CantidadStock INT NOT NULL
);

-- Crear la tabla Reportes
CREATE TABLE Reportes (
    IDReporte INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TipoReporte ENUM('diario','semanal','mensual') NOT NULL,
    Fecha DATE,
    Mes INT,
    Anio INT,
    TotalVentas DECIMAL(10,2) NOT NULL,
    OtrosDetalles TEXT
);

-- Crear la tabla Ventas
CREATE TABLE Ventas (
    IDVenta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Cliente VARCHAR(255),
    IDEmpleado INT,
    FechaVenta DATETIME NOT NULL,
    TotalVenta DECIMAL(10,2) NOT NULL,
    TotalExtra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    DetallesVenta TEXT,
    TotalFinal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Estado ENUM('pendiente','finalizada') NOT NULL DEFAULT 'pendiente',
    MetodoPago ENUM('efectivo','tarjeta','codigo_qr')
);

