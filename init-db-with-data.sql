-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: xiaosen_food
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `food_id` int NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` bigint DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_categories_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'家常菜','日常家庭菜肴','🥘',1,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL),(2,'汤羹','营养汤品','🍲',2,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL),(3,'早餐','营养早餐','🍳',3,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL),(4,'甜点','自制甜品','🍰',4,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL),(5,'小吃','休闲小吃','🥟',5,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL),(6,'饮品','自制饮料','🥤',6,'2026-04-07 09:03:13.000','2026-04-07 09:03:13.000',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `meals` json DEFAULT NULL,
  `tags` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '4.0',
  `is_featured` tinyint(1) DEFAULT '0',
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `seasonings` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `foods_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'红烧肉','肥而不腻，入口即化的家常红烧肉','https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=600',1,'[\"lunch\", \"dinner\"]','下饭菜,经典',4.9,1,'五花肉500g, 冰糖30g, 生抽2勺, 老抽1勺, 料酒2勺, 生姜3片, 八角2个','生抽, 老抽, 料酒, 冰糖, 八角','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(2,'西红柿鸡蛋汤','清爽开胃的西红柿鸡蛋汤','https://images.unsplash.com/photo-1547592166-23acbe346499?w=600',2,'[\"lunch\", \"dinner\"]','快手,清淡',4.7,0,'西红柿2个, 鸡蛋2个, 葱花适量','盐, 鸡精, 香油','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(3,'蛋炒饭','粒粒分明的黄金蛋炒饭','https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=600',1,'[\"breakfast\", \"lunch\", \"dinner\"]','快手,主食',4.6,1,'隔夜米饭2碗, 鸡蛋3个, 火腿肠1根, 胡萝卜丁50g','盐, 生抽, 白胡椒粉','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(4,'葱花鸡蛋饼','香软的葱花鸡蛋饼，早餐首选','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',3,'[\"breakfast\"]','快手,早餐',4.5,0,'面粉200g, 鸡蛋2个, 葱花适量','盐, 五香粉','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(5,'小米粥','养胃小米粥，早餐必备','https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=600',3,'[\"breakfast\"]','养生,早餐',4.6,1,'小米100g, 清水适量, 红枣5颗','冰糖','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(6,'煎饺子','金黄酥脆的煎饺','https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600',5,'[\"breakfast\", \"lunch\", \"dinner\"]','主食,经典',4.7,1,'饺子15个, 食用油2勺, 清水半碗','醋, 生抽, 辣椒油','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(7,'可乐鸡翅','甜中带咸的可乐鸡翅','https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600',1,'[\"lunch\", \"dinner\"]','下饭菜,人气',4.8,0,'鸡翅中10个, 可乐1罐, 生姜3片','生抽, 老抽, 料酒, 盐','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(8,'清蒸鲈鱼','鲜嫩清蒸鲈鱼','https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',1,'[\"lunch\", \"dinner\"]','清淡,营养',4.8,1,'鲈鱼1条, 生姜5片, 葱2根','蒸鱼豉油, 料酒, 盐','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(9,'自制奶茶','香浓顺滑的自制奶茶','https://images.unsplash.com/photo-1558855410-3112e255e40e?w=600',6,'[\"breakfast\"]','甜品,自制',4.8,0,'红茶包2个, 牛奶500ml, 白糖适量','红茶, 牛奶, 糖','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL),(10,'芒果班戟','松软香甜的芒果班戟','https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600',4,'[\"breakfast\"]','甜品,下午茶',4.9,1,'低筋面粉100g, 牛奶250ml, 芒果1个','糖粉, 香草精','2026-04-07 09:03:13','2026-04-07 10:13:29',NULL);
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_history`
--

DROP TABLE IF EXISTS `meal_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `food_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `meal_history_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_history`
--

LOCK TABLES `meal_history` WRITE;
/*!40000 ALTER TABLE `meal_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$YourHashedPasswordHere','admin@xiaosen.com','admin',1,'2026-04-07 09:03:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-07 10:15:09
