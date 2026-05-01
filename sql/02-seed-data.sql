-- ============================================================
-- SCRIPT 2: Datos de prueba para Shop.Auth + Shop.Api
-- Ejecutar DESPUÉS de 01-create-tables.sql
-- ============================================================

-- ========================
-- AUTH: Usuarios de prueba
-- ========================
-- Contraseña para todos: Test1234!
-- Hash BCrypt generado con 12 rondas

INSERT INTO "Users" ("Id", "Email", "PasswordHash", "FirstName", "LastName", "Phone", "Role", "IsActive", "CreatedAt")
VALUES
(
    'a1b2c3d4-1111-4000-8000-000000000001',
    'admin@shop.com',
    '$2a$12$LJ3m4ys3GZkPTzCUJ8FHzOOjvFmD/KYnEvBCwsqFHvOjR6QM1bBxm',
    'Admin',
    'Sistema',
    '+525500000001',
    'Admin',
    TRUE,
    NOW()
),
(
    'a1b2c3d4-2222-4000-8000-000000000002',
    'carlos@shop.com',
    '$2a$12$LJ3m4ys3GZkPTzCUJ8FHzOOjvFmD/KYnEvBCwsqFHvOjR6QM1bBxm',
    'Carlos',
    'Mendoza',
    '+525512345678',
    'Customer',
    TRUE,
    NOW()
),
(
    'a1b2c3d4-3333-4000-8000-000000000003',
    'maria@shop.com',
    '$2a$12$LJ3m4ys3GZkPTzCUJ8FHzOOjvFmD/KYnEvBCwsqFHvOjR6QM1bBxm',
    'María',
    'García',
    '+525587654321',
    'Customer',
    TRUE,
    NOW()
),
(
    'a1b2c3d4-4444-4000-8000-000000000004',
    'ana@shop.com',
    '$2a$12$LJ3m4ys3GZkPTzCUJ8FHzOOjvFmD/KYnEvBCwsqFHvOjR6QM1bBxm',
    'Ana',
    'López',
    '+525533344455',
    'Customer',
    TRUE,
    NOW()
);

-- ========================
-- SHOP: Categorías
-- ========================
INSERT INTO "Categories" ("Id", "Name", "Description", "Gender", "CreatedAt")
VALUES
('c1d2e3f4-1001-4000-8000-000000000001', 'Camisetas',        'Playeras, camisetas y tops',                    'Unisex', NOW()),
('c1d2e3f4-1002-4000-8000-000000000002', 'Pantalones',        'Jeans, chinos, joggers y pantalones formales',  'Unisex', NOW()),
('c1d2e3f4-1003-4000-8000-000000000003', 'Vestidos',          'Vestidos casuales, de fiesta y formales',       'Women',  NOW()),
('c1d2e3f4-1004-4000-8000-000000000004', 'Chaquetas',         'Chamarras, blazers, sudaderas con cierre',      'Unisex', NOW()),
('c1d2e3f4-1005-4000-8000-000000000005', 'Zapatos',           'Tenis, botas, zapatos formales y casuales',     'Unisex', NOW()),
('c1d2e3f4-1006-4000-8000-000000000006', 'Accesorios',        'Cinturones, gorras, bufandas, bolsos',          'Unisex', NOW()),
('c1d2e3f4-1007-4000-8000-000000000007', 'Ropa Deportiva',    'Leggings, shorts, tops deportivos',             'Unisex', NOW()),
('c1d2e3f4-1008-4000-8000-000000000008', 'Ropa Infantil',     'Playeras, pantalones y conjuntos para niños',   'Kids',   NOW());

-- ========================
-- SHOP: Productos
-- ========================
INSERT INTO "Products" ("Id", "Name", "Description", "Sku", "Price", "CostPrice", "TotalStock", "Status", "Brand", "Material", "Color", "CategoryId", "CreatedAt")
VALUES
-- Camisetas
('b2d3e4f5-2001-4000-8000-000000000001',
 'Camiseta Algodón Clásica',
 'Camiseta 100% algodón peinado, corte regular fit. Suave al tacto, ideal para uso diario.',
 'CAM-ALG-001', 349.99, 180.00, 200, 'Active', 'UrbanStyle', '100% Algodón', 'Negro',
 'c1d2e3f4-1001-4000-8000-000000000001', NOW()),

('b2d3e4f5-2002-4000-8000-000000000002',
 'Camiseta Slim Fit Premium',
 'Camiseta con mezcla de algodón y elastano, corte slim fit. Acabado satinado.',
 'CAM-SLM-002', 499.99, 260.00, 150, 'Active', 'UrbanStyle', '95% Algodón 5% Elastano', 'Blanco',
 'c1d2e3f4-1001-4000-8000-000000000001', NOW()),

('b2d3e4f5-2003-4000-8000-000000000003',
 'Camiseta Estampado Gráfico',
 'Camiseta oversize con estampado gráfico exclusivo. Look urbano y moderno.',
 'CAM-GRF-003', 599.99, 320.00, 100, 'Active', 'StreetVibe', '100% Algodón', 'Gris',
 'c1d2e3f4-1001-4000-8000-000000000001', NOW()),

-- Pantalones
('b2d3e4f5-2004-4000-8000-000000000004',
 'Jeans Slim Fit',
 'Jeans de mezclilla elástica, corte slim fit. Lavado medio, 5 bolsillos.',
 'PAN-JNS-004', 899.99, 450.00, 120, 'Active', 'DenimCo', '98% Algodón 2% Elastano', 'Azul',
 'c1d2e3f4-1002-4000-8000-000000000002', NOW()),

('b2d3e4f5-2005-4000-8000-000000000005',
 'Pantalón Chino Casual',
 'Chino de algodón stretch, corte recto. Ideal para oficina y uso casual.',
 'PAN-CHN-005', 749.99, 380.00, 90, 'Active', 'UrbanStyle', '97% Algodón 3% Elastano', 'Beige',
 'c1d2e3f4-1002-4000-8000-000000000002', NOW()),

('b2d3e4f5-2006-4000-8000-000000000006',
 'Jogger Cargo',
 'Jogger con bolsillos cargo laterales, cintura elástica con cordón. Estilo streetwear.',
 'PAN-JGR-006', 649.99, 310.00, 80, 'Active', 'StreetVibe', '65% Algodón 35% Poliéster', 'Verde Olivo',
 'c1d2e3f4-1002-4000-8000-000000000002', NOW()),

-- Vestidos
('b2d3e4f5-2007-4000-8000-000000000007',
 'Vestido Midi Floral',
 'Vestido midi con estampado floral, escote en V. Ideal para primavera.',
 'VES-MID-007', 799.99, 420.00, 60, 'Active', 'BellaModa', '100% Viscosa', 'Estampado Floral',
 'c1d2e3f4-1003-4000-8000-000000000003', NOW()),

('b2d3e4f5-2008-4000-8000-000000000008',
 'Vestido Cóctel Negro',
 'Vestido corto de cóctel, corte entallado. Perfecto para eventos y fiestas.',
 'VES-COC-008', 1299.99, 680.00, 40, 'Active', 'BellaModa', '95% Poliéster 5% Elastano', 'Negro',
 'c1d2e3f4-1003-4000-8000-000000000003', NOW()),

-- Chaquetas
('b2d3e4f5-2009-4000-8000-000000000009',
 'Chamarra de Mezclilla',
 'Chamarra de mezclilla clásica con detalle de costuras. Forro interior.',
 'CHQ-MEZ-009', 1199.99, 600.00, 70, 'Active', 'DenimCo', '100% Algodón', 'Azul Medio',
 'c1d2e3f4-1004-4000-8000-000000000004', NOW()),

('b2d3e4f5-2010-4000-8000-000000000010',
 'Sudadera con Capucha',
 'Sudadera hoodie con bolsillo canguro, felpa interior térmica. Logo bordado.',
 'CHQ-HOD-010', 849.99, 430.00, 110, 'Active', 'StreetVibe', '80% Algodón 20% Poliéster', 'Gris Melange',
 'c1d2e3f4-1004-4000-8000-000000000004', NOW()),

-- Zapatos
('b2d3e4f5-2011-4000-8000-000000000011',
 'Tenis Urban Runner',
 'Tenis ligeros con suela de EVA, diseño urbano. Máxima comodidad.',
 'ZAP-TNS-011', 1499.99, 750.00, 100, 'Active', 'StreetVibe', 'Malla Textil / Suela Sintética', 'Negro/Blanco',
 'c1d2e3f4-1005-4000-8000-000000000005', NOW()),

('b2d3e4f5-2012-4000-8000-000000000012',
 'Botas Chelsea',
 'Botas Chelsea de piel sintética, elástico lateral. Suela de goma antiderrapante.',
 'ZAP-BTS-012', 1799.99, 950.00, 50, 'Active', 'UrbanStyle', 'Piel Sintética', 'Café',
 'c1d2e3f4-1005-4000-8000-000000000005', NOW()),

-- Accesorios
('b2d3e4f5-2013-4000-8000-000000000013',
 'Cinturón de Piel',
 'Cinturón de piel genuina con hebilla metálica. Acabado clásico.',
 'ACC-CTN-013', 449.99, 220.00, 80, 'Active', 'UrbanStyle', 'Piel Genuina', 'Café',
 'c1d2e3f4-1006-4000-8000-000000000006', NOW()),

('b2d3e4f5-2014-4000-8000-000000000014',
 'Gorra Snapback',
 'Gorra snapback ajustable con logo bordado. Visera curva.',
 'ACC-GOR-014', 299.99, 140.00, 120, 'Active', 'StreetVibe', 'Algodón', 'Negro',
 'c1d2e3f4-1006-4000-8000-000000000006', NOW()),

-- Ropa Deportiva
('b2d3e4f5-2015-4000-8000-000000000015',
 'Leggings Deportivos',
 'Leggings de compresión con cintura alta. Tecnología DryFit.',
 'DEP-LEG-015', 599.99, 300.00, 90, 'Active', 'FitPro', '88% Poliéster 12% Elastano', 'Negro',
 'c1d2e3f4-1007-4000-8000-000000000007', NOW()),

('b2d3e4f5-2016-4000-8000-000000000016',
 'Short Deportivo',
 'Short ligero con forro interior, bolsillo trasero con cierre.',
 'DEP-SHT-016', 399.99, 190.00, 80, 'Active', 'FitPro', '100% Poliéster', 'Azul',
 'c1d2e3f4-1007-4000-8000-000000000007', NOW()),

-- Ropa Infantil
('b2d3e4f5-2017-4000-8000-000000000017',
 'Playera Infantil Dinosaurio',
 'Playera de algodón para niños con estampado de dinosaurio. Suave y cómoda.',
 'INF-PLY-017', 249.99, 120.00, 100, 'Active', 'KidStyle', '100% Algodón', 'Verde',
 'c1d2e3f4-1008-4000-8000-000000000008', NOW()),

-- Producto Inactivo (para probar el filtro)
('b2d3e4f5-2018-4000-8000-000000000018',
 'Sudadera Vintage (Descontinuada)',
 'Sudadera de colección pasada. Ya no se fabrica.',
 'CHQ-VTG-018', 699.99, 350.00, 0, 'Discontinued', 'UrbanStyle', 'Algodón', 'Rojo',
 'c1d2e3f4-1004-4000-8000-000000000004', NOW());

-- ========================
-- SHOP: Tallas por producto
-- ========================
-- Camiseta Algodón Clásica
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3001-4000-8000-000000000001', 'XS', 20, 'b2d3e4f5-2001-4000-8000-000000000001', NOW()),
('d1e2f3a4-3002-4000-8000-000000000002', 'S',  40, 'b2d3e4f5-2001-4000-8000-000000000001', NOW()),
('d1e2f3a4-3003-4000-8000-000000000003', 'M',  60, 'b2d3e4f5-2001-4000-8000-000000000001', NOW()),
('d1e2f3a4-3004-4000-8000-000000000004', 'L',  50, 'b2d3e4f5-2001-4000-8000-000000000001', NOW()),
('d1e2f3a4-3005-4000-8000-000000000005', 'XL', 30, 'b2d3e4f5-2001-4000-8000-000000000001', NOW());

-- Camiseta Slim Fit Premium
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3011-4000-8000-000000000006', 'S',  30, 'b2d3e4f5-2002-4000-8000-000000000002', NOW()),
('d1e2f3a4-3011-4000-8000-000000000007', 'M',  50, 'b2d3e4f5-2002-4000-8000-000000000002', NOW()),
('d1e2f3a4-3011-4000-8000-000000000008', 'L',  40, 'b2d3e4f5-2002-4000-8000-000000000002', NOW()),
('d1e2f3a4-3011-4000-8000-000000000009', 'XL', 30, 'b2d3e4f5-2002-4000-8000-000000000002', NOW());

-- Camiseta Estampado Gráfico
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3021-4000-8000-000000000010', 'S',  25, 'b2d3e4f5-2003-4000-8000-000000000003', NOW()),
('d1e2f3a4-3021-4000-8000-000000000011', 'M',  40, 'b2d3e4f5-2003-4000-8000-000000000003', NOW()),
('d1e2f3a4-3021-4000-8000-000000000012', 'L',  25, 'b2d3e4f5-2003-4000-8000-000000000003', NOW()),
('d1e2f3a4-3021-4000-8000-000000000013', 'XL', 10, 'b2d3e4f5-2003-4000-8000-000000000003', NOW());

-- Jeans Slim Fit
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3031-4000-8000-000000000014', 'S',  25, 'b2d3e4f5-2004-4000-8000-000000000004', NOW()),
('d1e2f3a4-3031-4000-8000-000000000015', 'M',  40, 'b2d3e4f5-2004-4000-8000-000000000004', NOW()),
('d1e2f3a4-3031-4000-8000-000000000016', 'L',  35, 'b2d3e4f5-2004-4000-8000-000000000004', NOW()),
('d1e2f3a4-3031-4000-8000-000000000017', 'XL', 20, 'b2d3e4f5-2004-4000-8000-000000000004', NOW());

-- Pantalón Chino
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3041-4000-8000-000000000018', 'S',  20, 'b2d3e4f5-2005-4000-8000-000000000005', NOW()),
('d1e2f3a4-3041-4000-8000-000000000019', 'M',  30, 'b2d3e4f5-2005-4000-8000-000000000005', NOW()),
('d1e2f3a4-3041-4000-8000-000000000020', 'L',  25, 'b2d3e4f5-2005-4000-8000-000000000005', NOW()),
('d1e2f3a4-3041-4000-8000-000000000021', 'XL', 15, 'b2d3e4f5-2005-4000-8000-000000000005', NOW());

-- Jogger Cargo
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3051-4000-8000-000000000022', 'S',  20, 'b2d3e4f5-2006-4000-8000-000000000006', NOW()),
('d1e2f3a4-3051-4000-8000-000000000023', 'M',  30, 'b2d3e4f5-2006-4000-8000-000000000006', NOW()),
('d1e2f3a4-3051-4000-8000-000000000024', 'L',  20, 'b2d3e4f5-2006-4000-8000-000000000006', NOW()),
('d1e2f3a4-3051-4000-8000-000000000025', 'XL', 10, 'b2d3e4f5-2006-4000-8000-000000000006', NOW());

-- Vestido Midi Floral
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3061-4000-8000-000000000026', 'S',  15, 'b2d3e4f5-2007-4000-8000-000000000007', NOW()),
('d1e2f3a4-3061-4000-8000-000000000027', 'M',  25, 'b2d3e4f5-2007-4000-8000-000000000007', NOW()),
('d1e2f3a4-3061-4000-8000-000000000028', 'L',  15, 'b2d3e4f5-2007-4000-8000-000000000007', NOW()),
('d1e2f3a4-3061-4000-8000-000000000029', 'XL', 5,  'b2d3e4f5-2007-4000-8000-000000000007', NOW());

-- Vestido Cóctel
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3071-4000-8000-000000000030', 'S',  10, 'b2d3e4f5-2008-4000-8000-000000000008', NOW()),
('d1e2f3a4-3071-4000-8000-000000000031', 'M',  15, 'b2d3e4f5-2008-4000-8000-000000000008', NOW()),
('d1e2f3a4-3071-4000-8000-000000000032', 'L',  10, 'b2d3e4f5-2008-4000-8000-000000000008', NOW()),
('d1e2f3a4-3071-4000-8000-000000000033', 'XL', 5,  'b2d3e4f5-2008-4000-8000-000000000008', NOW());

-- Chamarra de Mezclilla
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3081-4000-8000-000000000034', 'S',  15, 'b2d3e4f5-2009-4000-8000-000000000009', NOW()),
('d1e2f3a4-3081-4000-8000-000000000035', 'M',  25, 'b2d3e4f5-2009-4000-8000-000000000009', NOW()),
('d1e2f3a4-3081-4000-8000-000000000036', 'L',  20, 'b2d3e4f5-2009-4000-8000-000000000009', NOW()),
('d1e2f3a4-3081-4000-8000-000000000037', 'XL', 10, 'b2d3e4f5-2009-4000-8000-000000000009', NOW());

-- Sudadera con Capucha
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3091-4000-8000-000000000038', 'S',  25, 'b2d3e4f5-2010-4000-8000-000000000010', NOW()),
('d1e2f3a4-3091-4000-8000-000000000039', 'M',  40, 'b2d3e4f5-2010-4000-8000-000000000010', NOW()),
('d1e2f3a4-3091-4000-8000-000000000040', 'L',  30, 'b2d3e4f5-2010-4000-8000-000000000010', NOW()),
('d1e2f3a4-3091-4000-8000-000000000041', 'XL', 15, 'b2d3e4f5-2010-4000-8000-000000000010', NOW());

-- Tenis Urban Runner (solo tallas numéricas como string)
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3101-4000-8000-000000000042', 'S',  20, 'b2d3e4f5-2011-4000-8000-000000000011', NOW()),
('d1e2f3a4-3101-4000-8000-000000000043', 'M',  35, 'b2d3e4f5-2011-4000-8000-000000000011', NOW()),
('d1e2f3a4-3101-4000-8000-000000000044', 'L',  30, 'b2d3e4f5-2011-4000-8000-000000000011', NOW()),
('d1e2f3a4-3101-4000-8000-000000000045', 'XL', 15, 'b2d3e4f5-2011-4000-8000-000000000011', NOW());

-- Botas Chelsea
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3111-4000-8000-000000000046', 'S',  10, 'b2d3e4f5-2012-4000-8000-000000000012', NOW()),
('d1e2f3a4-3111-4000-8000-000000000047', 'M',  20, 'b2d3e4f5-2012-4000-8000-000000000012', NOW()),
('d1e2f3a4-3111-4000-8000-000000000048', 'L',  15, 'b2d3e4f5-2012-4000-8000-000000000012', NOW()),
('d1e2f3a4-3111-4000-8000-000000000049', 'XL', 5,  'b2d3e4f5-2012-4000-8000-000000000012', NOW());

-- Cinturón (sin talla)
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3121-4000-8000-000000000050', 'M', 80, 'b2d3e4f5-2013-4000-8000-000000000013', NOW());

-- Gorra
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3131-4000-8000-000000000051', 'M', 120, 'b2d3e4f5-2014-4000-8000-000000000014', NOW());

-- Leggings
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3141-4000-8000-000000000052', 'S',  20, 'b2d3e4f5-2015-4000-8000-000000000015', NOW()),
('d1e2f3a4-3141-4000-8000-000000000053', 'M',  35, 'b2d3e4f5-2015-4000-8000-000000000015', NOW()),
('d1e2f3a4-3141-4000-8000-000000000054', 'L',  25, 'b2d3e4f5-2015-4000-8000-000000000015', NOW()),
('d1e2f3a4-3141-4000-8000-000000000055', 'XL', 10, 'b2d3e4f5-2015-4000-8000-000000000015', NOW());

-- Short Deportivo
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3151-4000-8000-000000000056', 'S',  20, 'b2d3e4f5-2016-4000-8000-000000000016', NOW()),
('d1e2f3a4-3151-4000-8000-000000000057', 'M',  30, 'b2d3e4f5-2016-4000-8000-000000000016', NOW()),
('d1e2f3a4-3151-4000-8000-000000000058', 'L',  20, 'b2d3e4f5-2016-4000-8000-000000000016', NOW()),
('d1e2f3a4-3151-4000-8000-000000000059', 'XL', 10, 'b2d3e4f5-2016-4000-8000-000000000016', NOW());

-- Playera Infantil
INSERT INTO "ProductSizes" ("Id", "Size", "Stock", "ProductId", "CreatedAt") VALUES
('d1e2f3a4-3161-4000-8000-000000000060', 'XS', 25, 'b2d3e4f5-2017-4000-8000-000000000017', NOW()),
('d1e2f3a4-3161-4000-8000-000000000061', 'S',  35, 'b2d3e4f5-2017-4000-8000-000000000017', NOW()),
('d1e2f3a4-3161-4000-8000-000000000062', 'M',  30, 'b2d3e4f5-2017-4000-8000-000000000017', NOW()),
('d1e2f3a4-3161-4000-8000-000000000063', 'L',  10, 'b2d3e4f5-2017-4000-8000-000000000017', NOW());

-- ========================
-- SHOP: Clientes
-- ========================
INSERT INTO "Customers" ("Id", "FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "PostalCode", "Country", "AuthUserId", "CreatedAt")
VALUES
('e1f2a3b4-4001-4000-8000-000000000001',
 'Carlos', 'Mendoza',
 'carlos@shop.com', '+525512345678',
 'Av. Reforma 123, Col. Centro', 'CDMX', 'CDMX', '06600', 'México',
 'a1b2c3d4-2222-4000-8000-000000000002', NOW()),

('e1f2a3b4-4002-4000-8000-000000000002',
 'María', 'García',
 'maria@shop.com', '+525587654321',
 'Calle Independencia 456, Col. Juárez', 'Guadalajara', 'Jalisco', '44100', 'México',
 'a1b2c3d4-3333-4000-8000-000000000003', NOW()),

('e1f2a3b4-4003-4000-8000-000000000003',
 'Ana', 'López',
 'ana@shop.com', '+525533344455',
 'Blvd. Kukulcán Km 12, Zona Hotelera', 'Cancún', 'Quintana Roo', '77500', 'México',
 'a1b2c3d4-4444-4000-8000-000000000004', NOW());

-- ========================
-- SHOP: Órdenes de ejemplo
-- ========================
INSERT INTO "Orders" ("Id", "OrderNumber", "CustomerId", "Status", "Subtotal", "Tax", "ShippingCost", "Total", "ShippingAddress", "Notes", "CreatedAt")
VALUES
('f1a2b3c4-5001-4000-8000-000000000001',
 'ORD-20250101120000-1001',
 'e1f2a3b4-4001-4000-8000-000000000001',
 'Delivered',
 849.98, 136.00, 99.00, 1084.98,
 'Av. Reforma 123, Col. Centro, CDMX, 06600',
 'Entregar en el departamento 4B',
 NOW() - INTERVAL '30 days'),

('f1a2b3c4-5002-4000-8000-000000000002',
 'ORD-20250102144000-2002',
 'e1f2a3b4-4002-4000-8000-000000000002',
 'Shipped',
 1949.98, 312.00, 0.00, 2261.98,
 'Calle Independencia 456, Col. Juárez, Guadalajara, 44100',
 NULL,
 NOW() - INTERVAL '5 days'),

('f1a2b3c4-5003-4000-8000-000000000003',
 'ORD-20250103150000-3003',
 'e1f2a3b4-4003-4000-8000-000000000003',
 'Pending',
 1299.99, 208.00, 149.00, 1656.99,
 'Blvd. Kukulcán Km 12, Zona Hotelera, Cancún, 77500',
 'Llamar antes de entregar',
 NOW() - INTERVAL '1 day'),

('f1a2b3c4-5004-4000-8000-000000000004',
 'ORD-20250104093000-4004',
 'e1f2a3b4-4001-4000-8000-000000000001',
 'Confirmed',
 1199.99, 192.00, 0.00, 1391.99,
 'Av. Reforma 123, Col. Centro, CDMX, 06600',
 NULL,
 NOW());

-- ========================
-- SHOP: Ítems de órdenes
-- ========================
-- Orden 1 (Delivered): 2x Camiseta Algodón Clásica talla M
INSERT INTO "OrderItems" ("Id", "OrderId", "ProductId", "Size", "Quantity", "UnitPrice", "Total", "CreatedAt")
VALUES
('a1b2c3d4-6001-4000-8000-000000000001',
 'f1a2b3c4-5001-4000-8000-000000000001',
 'b2d3e4f5-2001-4000-8000-000000000001',
 'M', 2, 349.99, 699.98, NOW() - INTERVAL '30 days'),

('a1b2c3d4-6002-4000-8000-000000000002',
 'f1a2b3c4-5001-4000-8000-000000000001',
 'b2d3e4f5-2014-4000-8000-000000000014',
 'M', 1, 299.99, 299.99, NOW() - INTERVAL '30 days');

-- Orden 2 (Shipped): 2x Chamarra + 1x Gorra
INSERT INTO "OrderItems" ("Id", "OrderId", "ProductId", "Size", "Quantity", "UnitPrice", "Total", "CreatedAt")
VALUES
('a1b2c3d4-6003-4000-8000-000000000003',
 'f1a2b3c4-5002-4000-8000-000000000002',
 'b2d3e4f5-2009-4000-8000-000000000009',
 'M', 1, 1199.99, 1199.99, NOW() - INTERVAL '5 days'),

('a1b2c3d4-6004-4000-8000-000000000004',
 'f1a2b3c4-5002-4000-8000-000000000002',
 'b2d3e4f5-2014-4000-8000-000000000014',
 'M', 1, 299.99, 299.99, NOW() - INTERVAL '5 days'),

('a1b2c3d4-6005-4000-8000-000000000005',
 'f1a2b3c4-5002-4000-8000-000000000002',
 'b2d3e4f5-2001-4000-8000-000000000001',
 'L', 1, 349.99, 349.99, NOW() - INTERVAL '5 days');

-- Orden 3 (Pending): 1x Vestido Cóctel talla M
INSERT INTO "OrderItems" ("Id", "OrderId", "ProductId", "Size", "Quantity", "UnitPrice", "Total", "CreatedAt")
VALUES
('a1b2c3d4-6006-4000-8000-000000000006',
 'f1a2b3c4-5003-4000-8000-000000000003',
 'b2d3e4f5-2008-4000-8000-000000000008',
 'M', 1, 1299.99, 1299.99, NOW() - INTERVAL '1 day');

-- Orden 4 (Confirmed): 1x Jeans Slim Fit talla M
INSERT INTO "OrderItems" ("Id", "OrderId", "ProductId", "Size", "Quantity", "UnitPrice", "Total", "CreatedAt")
VALUES
('a1b2c3d4-6007-4000-8000-000000000007',
 'f1a2b3c4-5004-4000-8000-000000000004',
 'b2d3e4f5-2004-4000-8000-000000000004',
 'M', 1, 899.99, 899.99, NOW());
