CREATE DATABASE  IF NOT EXISTS `stylish` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `stylish`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: database-1.c1h3yzeu8yjd.us-east-2.rds.amazonaws.com    Database: stylish
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `picture` varchar(10000) NOT NULL COMMENT 'Picture URL.',
  `story` varchar(3000) NOT NULL COMMENT 'Multiline story.',
  PRIMARY KEY (`id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_list`
--

DROP TABLE IF EXISTS `order_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `color_name` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `order_number` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=188635 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_table`
--

DROP TABLE IF EXISTS `order_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` bigint(20) DEFAULT NULL,
  `prime` varchar(255) DEFAULT NULL,
  `shipping` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  `subtotal` int(11) DEFAULT NULL,
  `freight` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `recipient` varchar(255) DEFAULT NULL,
  `list` varchar(10000) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=803026 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL COMMENT 'Product id.',
  `category` varchar(255) COLLATE utf8_bin NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Product title.',
  `description` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Product description.',
  `price` int(11) NOT NULL COMMENT 'Product price.',
  `texture` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Product texture.',
  `wash` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'The way we can wash the product.',
  `place` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Place of production.',
  `note` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'The note of product.',
  `story` varchar(1000) CHARACTER SET utf8 NOT NULL COMMENT 'Product multiline story.',
  `colors` varchar(3000) CHARACTER SET utf8 NOT NULL COMMENT 'Possible color choices.',
  `sizes` varchar(255) COLLATE utf8_bin NOT NULL COMMENT 'Possible size choices.',
  `variants` varchar(3000) CHARACTER SET utf8 NOT NULL COMMENT 'Possible variants, including stock records.',
  `main_image` varchar(1000) CHARACTER SET utf8 NOT NULL COMMENT 'Main image.',
  `images` varchar(10000) CHARACTER SET utf8 NOT NULL COMMENT 'Other images.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL COMMENT 'User''s id.',
  `provider` varchar(255) NOT NULL COMMENT '	Service provider.',
  `name` varchar(255) DEFAULT NULL COMMENT '	User''s name.',
  `email` varchar(255) DEFAULT NULL COMMENT 'User''s email.',
  `picture` varchar(10000) DEFAULT NULL COMMENT 'User''s picture.',
  `access_token` varchar(255) NOT NULL,
  `login_time` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `access_expired` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-25 17:39:56
