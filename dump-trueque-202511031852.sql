-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: trueque
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria_oferta`
--

DROP TABLE IF EXISTS `categoria_oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_oferta` (
  `categoria_oferta_id` int NOT NULL AUTO_INCREMENT,
  `categoria_oferta_nombre` varchar(55) NOT NULL,
  `usuario_creacion` varchar(45) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `usuario_modificacion` varchar(45) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `estado_registro` smallint NOT NULL,
  PRIMARY KEY (`categoria_oferta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_oferta`
--

LOCK TABLES `categoria_oferta` WRITE;
/*!40000 ALTER TABLE `categoria_oferta` DISABLE KEYS */;
INSERT INTO `categoria_oferta` VALUES (3,'ELECTRÓNICOS','admin','2025-11-03 16:33:09','admin','2025-11-03 17:04:43',0),(4,'ELECTRÓNICOS','admin','2025-11-03 16:33:11',NULL,NULL,1),(5,'VERDURAS','admin','2025-11-03 16:33:12','admin','2025-11-03 17:10:03',1),(6,'ELECTRÓNICOS','admin','2025-11-03 16:33:14',NULL,NULL,1);
/*!40000 ALTER TABLE `categoria_oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_oferta`
--

DROP TABLE IF EXISTS `estado_oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_oferta` (
  `estado_oferta_id` int NOT NULL AUTO_INCREMENT,
  `estado_oferta_nombre` varchar(55) NOT NULL,
  `usuario_creacion` varchar(45) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `usuario_modificacion` varchar(45) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `estado_registro` smallint NOT NULL,
  PRIMARY KEY (`estado_oferta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_oferta`
--

LOCK TABLES `estado_oferta` WRITE;
/*!40000 ALTER TABLE `estado_oferta` DISABLE KEYS */;
INSERT INTO `estado_oferta` VALUES (1,'BORRADOR','admin','2025-11-03 17:55:58','luis','2025-11-03 18:00:38',1);
/*!40000 ALTER TABLE `estado_oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen_oferta`
--

DROP TABLE IF EXISTS `imagen_oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen_oferta` (
  `imagen_oferta_id` int NOT NULL AUTO_INCREMENT,
  `oferta_id` bigint NOT NULL,
  `imagen_oferta_nombre` varchar(55) NOT NULL,
  `imagen_oferta_ruta` varchar(255) DEFAULT NULL,
  `usuario_creacion` varchar(45) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `usuario_modificacion` varchar(45) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `estado_registro` smallint NOT NULL,
  PRIMARY KEY (`imagen_oferta_id`),
  KEY `fk_imagen_oferta_oferta_idx` (`oferta_id`),
  CONSTRAINT `fk_imagen_oferta_oferta` FOREIGN KEY (`oferta_id`) REFERENCES `oferta` (`oferta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen_oferta`
--

LOCK TABLES `imagen_oferta` WRITE;
/*!40000 ALTER TABLE `imagen_oferta` DISABLE KEYS */;
INSERT INTO `imagen_oferta` VALUES (1,4,'imagen_principal','uploads\\images\\imagen_principal_1762213523626.jpeg','admin','2025-11-03 18:45:24',NULL,NULL,1),(2,5,'imagen_principal','uploads\\images\\imagen_principal_1762213616017.jpeg','admin','2025-11-03 18:46:56',NULL,NULL,1),(3,5,'imagen_secundaria','uploads\\images\\imagen_secundaria_1762213616032.jpeg','admin','2025-11-03 18:46:56',NULL,NULL,1),(4,6,'imagen_principal','uploads\\images\\imagen_principal_1762213633342.jpeg','admin','2025-11-03 18:47:13',NULL,NULL,1),(5,6,'imagen_secundaria','uploads\\images\\imagen_secundaria_1762213633359.jpeg','admin','2025-11-03 18:47:13',NULL,NULL,1),(6,7,'imagen_principal','uploads\\images\\imagen_principal_1762213762945.jpeg','admin','2025-11-03 18:49:23',NULL,NULL,1),(7,7,'imagen_secundaria','uploads\\images\\imagen_secundaria_1762213762968.jpeg','admin','2025-11-03 18:49:23',NULL,NULL,1);
/*!40000 ALTER TABLE `imagen_oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oferta`
--

DROP TABLE IF EXISTS `oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oferta` (
  `oferta_id` bigint NOT NULL AUTO_INCREMENT,
  `oferta_titulo` varchar(255) NOT NULL,
  `oferta_condicion_trueque` varchar(255) NOT NULL,
  `oferta_comentario_obligatorio` varchar(255) NOT NULL,
  `oferta_latitud` decimal(11,8) NOT NULL,
  `oferta_longitud` decimal(11,8) NOT NULL,
  `categoria_oferta_id` int NOT NULL,
  `estado_oferta_id` int DEFAULT NULL,
  `usuario_creacion` varchar(45) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `usuario_modificacion` varchar(45) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `estado_registro` smallint DEFAULT NULL,
  PRIMARY KEY (`oferta_id`),
  KEY `fk_oferta_categoria_idx` (`categoria_oferta_id`),
  KEY `fk_oferta_estado_idx` (`estado_oferta_id`),
  CONSTRAINT `fk_oferta_categoria` FOREIGN KEY (`categoria_oferta_id`) REFERENCES `categoria_oferta` (`categoria_oferta_id`),
  CONSTRAINT `fk_oferta_estado` FOREIGN KEY (`estado_oferta_id`) REFERENCES `estado_oferta` (`estado_oferta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oferta`
--

LOCK TABLES `oferta` WRITE;
/*!40000 ALTER TABLE `oferta` DISABLE KEYS */;
INSERT INTO `oferta` VALUES (2,'Intercambio de libros de programación actualizado','Libros en excelente estado, sin páginas rotas','Disponible para intercambio toda la semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:18:24','admin','2025-11-03 18:26:24',1),(3,'Intercambio de libros de programación','Libros en buen estado, sin páginas rotas','Disponible para intercambio los fines de semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:44:46',NULL,NULL,1),(4,'Intercambio de libros de programación','Libros en buen estado, sin páginas rotas','Disponible para intercambio los fines de semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:45:24',NULL,NULL,1),(5,'Intercambio de libros de programación','Libros en buen estado, sin páginas rotas','Disponible para intercambio los fines de semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:46:56',NULL,NULL,1),(6,'Intercambio de libros de programación','Libros en buen estado, sin páginas rotas','Disponible para intercambio los fines de semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:47:13',NULL,NULL,1),(7,'Intercambio de libros de programación','Libros en buen estado, sin páginas rotas','Disponible para intercambio los fines de semana',-12.04637300,-77.04275400,4,1,'admin','2025-11-03 18:49:23',NULL,NULL,1);
/*!40000 ALTER TABLE `oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'trueque'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 18:52:46
