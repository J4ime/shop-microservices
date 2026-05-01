-- ============================================================
-- SCRIPT 1: Creación de tablas para Shop.Auth + Shop.Api
-- Base de datos: authdb (Auth) + shopdb (Shop)
-- PostgreSQL
-- ============================================================

-- ========================
-- AUTH DATABASE (authdb)
-- ========================

-- CREATE DATABASE authdb;  -- ejecutar primero

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "Users" (
    "Id"            UUID PRIMARY KEY,
    "Email"         VARCHAR(254)  NOT NULL,
    "PasswordHash"  VARCHAR(500)  NOT NULL,
    "FirstName"     VARCHAR(100)  NOT NULL,
    "LastName"      VARCHAR(100)  NOT NULL,
    "Phone"         VARCHAR(20),
    "Role"          VARCHAR(20)   NOT NULL DEFAULT 'Customer',
    "IsActive"      BOOLEAN       NOT NULL DEFAULT TRUE,
    "RefreshToken"  VARCHAR(500),
    "RefreshTokenExpiry" TIMESTAMPTZ,
    "CreatedAt"     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "UpdatedAt"     TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Email"
    ON "Users" ("Email");

-- ========================
-- SHOP DATABASE (shopdb)
-- ========================

-- CREATE DATABASE shopdb;  -- ejecutar primero

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categorías
CREATE TABLE IF NOT EXISTS "Categories" (
    "Id"          UUID PRIMARY KEY,
    "Name"        VARCHAR(100)  NOT NULL,
    "Description" VARCHAR(500),
    "Gender"      VARCHAR(20),
    "IsDeleted"   BOOLEAN       NOT NULL DEFAULT FALSE,
    "CreatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "UpdatedAt"   TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Categories_Name"
    ON "Categories" ("Name") WHERE "IsDeleted" = FALSE;

-- Productos
CREATE TABLE IF NOT EXISTS "Products" (
    "Id"          UUID PRIMARY KEY,
    "Name"        VARCHAR(200)   NOT NULL,
    "Description" VARCHAR(2000)  NOT NULL,
    "Sku"         VARCHAR(50)    NOT NULL,
    "Price"       DECIMAL(18,2)  NOT NULL,
    "CostPrice"   DECIMAL(18,2)  NOT NULL,
    "TotalStock"  INTEGER        NOT NULL DEFAULT 0,
    "Status"      VARCHAR(20)    NOT NULL DEFAULT 'Active',
    "Brand"       VARCHAR(100),
    "Material"    VARCHAR(100),
    "Color"       VARCHAR(50),
    "CategoryId"  UUID           NOT NULL REFERENCES "Categories"("Id"),
    "IsDeleted"   BOOLEAN        NOT NULL DEFAULT FALSE,
    "CreatedAt"   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    "UpdatedAt"   TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Products_Sku"
    ON "Products" ("Sku") WHERE "IsDeleted" = FALSE;

CREATE INDEX IF NOT EXISTS "IX_Products_CategoryId"
    ON "Products" ("CategoryId");

-- Tallas por producto
CREATE TABLE IF NOT EXISTS "ProductSizes" (
    "Id"        UUID PRIMARY KEY,
    "Size"      VARCHAR(10)  NOT NULL,
    "Stock"     INTEGER      NOT NULL DEFAULT 0,
    "ProductId" UUID         NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "IsDeleted" BOOLEAN      NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "IX_ProductSizes_ProductId"
    ON "ProductSizes" ("ProductId");

-- Clientes
CREATE TABLE IF NOT EXISTS "Customers" (
    "Id"         UUID PRIMARY KEY,
    "FirstName"  VARCHAR(100)  NOT NULL,
    "LastName"   VARCHAR(100)  NOT NULL,
    "Email"      VARCHAR(254)  NOT NULL,
    "Phone"      VARCHAR(20)   NOT NULL,
    "Address"    VARCHAR(300),
    "City"       VARCHAR(100),
    "State"      VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "Country"    VARCHAR(100),
    "AuthUserId" UUID,
    "IsDeleted"  BOOLEAN       NOT NULL DEFAULT FALSE,
    "CreatedAt"  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "UpdatedAt"  TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Customers_Email"
    ON "Customers" ("Email") WHERE "IsDeleted" = FALSE;

-- Órdenes
CREATE TABLE IF NOT EXISTS "Orders" (
    "Id"              UUID PRIMARY KEY,
    "OrderNumber"     VARCHAR(50)   NOT NULL,
    "CustomerId"      UUID          NOT NULL REFERENCES "Customers"("Id"),
    "Status"          VARCHAR(20)   NOT NULL DEFAULT 'Pending',
    "Subtotal"        DECIMAL(18,2) NOT NULL DEFAULT 0,
    "Tax"             DECIMAL(18,2) NOT NULL DEFAULT 0,
    "ShippingCost"    DECIMAL(18,2) NOT NULL DEFAULT 0,
    "Total"           DECIMAL(18,2) NOT NULL DEFAULT 0,
    "Notes"           VARCHAR(1000),
    "ShippingAddress" VARCHAR(500),
    "IsDeleted"       BOOLEAN       NOT NULL DEFAULT FALSE,
    "CreatedAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "UpdatedAt"       TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Orders_OrderNumber"
    ON "Orders" ("OrderNumber");

CREATE INDEX IF NOT EXISTS "IX_Orders_CustomerId"
    ON "Orders" ("CustomerId");

-- Ítems de orden
CREATE TABLE IF NOT EXISTS "OrderItems" (
    "Id"        UUID PRIMARY KEY,
    "OrderId"   UUID          NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "ProductId" UUID          NOT NULL REFERENCES "Products"("Id"),
    "Size"      VARCHAR(10)   NOT NULL,
    "Quantity"  INTEGER       NOT NULL,
    "UnitPrice" DECIMAL(18,2) NOT NULL,
    "Total"     DECIMAL(18,2) NOT NULL,
    "IsDeleted" BOOLEAN       NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "IX_OrderItems_OrderId"
    ON "OrderItems" ("OrderId");

CREATE INDEX IF NOT EXISTS "IX_OrderItems_ProductId"
    ON "OrderItems" ("ProductId");
