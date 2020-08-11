-- MySQL dump 10.13  Distrib 5.7.30, for Win64 (x86_64)
--
-- Host: localhost    Database: stylish
-- ------------------------------------------------------
-- Server version	5.7.30-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `picture` varchar(10000) NOT NULL COMMENT 'Picture URL.',
  `story` varchar(3000) NOT NULL COMMENT 'Multiline story.',
  PRIMARY KEY (`id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderlist`
--

DROP TABLE IF EXISTS `orderlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderlist` (
  `order_number` bigint(20) NOT NULL,
  `prime` varchar(255) NOT NULL,
  `shipping` varchar(255) NOT NULL,
  `payment` varchar(255) NOT NULL,
  `subtotal` int(11) NOT NULL,
  `freight` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `list` varchar(10000) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `colors` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT 'Possible color choices.',
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-27 14:38:45
