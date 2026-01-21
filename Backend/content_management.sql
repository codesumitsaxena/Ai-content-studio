-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: content_management
-- ------------------------------------------------------
-- Server version	8.0.44

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

--
-- Table structure for table `generated_content`
--

DROP TABLE IF EXISTS `generated_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generated_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `social_media_posted` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `image_name` (`image_name`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generated_content`
--

LOCK TABLES `generated_content` WRITE;
/*!40000 ALTER TABLE `generated_content` DISABLE KEYS */;
INSERT INTO `generated_content` VALUES (1,'AI_Image_21012026_15_25_39_78.jpeg','uploads\\images\\AI_Image_21012026_15_25_39_78.jpeg','? Lost in the beauty of nature with this lovely girl and her gorgeous flower! Such a perfect moment. ✨? #FlowerPower #BeautyAndBlooms #NatureLover #GirlWithFlower','pending',NULL,'2026-01-21 09:55:39','2026-01-21 09:55:39'),(2,'AI_Image_21012026_15_27_31_844.jpeg','uploads\\images\\AI_Image_21012026_15_27_31_844.jpeg','Unleashing the beast! ?️ There\'s nothing quite like the thrill of a bullet bike. Ready to hit the open road and feel the pure exhilaration. So much fun! ??️ #BulletBike #MotorcycleLife #RideOrDie #BikeAdventures #SpeedDemon','rejected',NULL,'2026-01-21 09:57:31','2026-01-21 10:08:21'),(3,'AI_Image_21012026_15_28_52_635.jpeg','uploads\\images\\AI_Image_21012026_15_28_52_635.jpeg','Making memories and learning new things every day! So much fun seeing these brilliant minds blossom at school. Cherishing these precious moments with our little ones. ✨?? #SchoolLife #KidsOfInstagram #LearningIsFun #FutureLeaders #HappyKids','approved','{\"twitter\": 0, \"facebook\": 1, \"linkedin\": 0, \"instagram\": 0}','2026-01-21 09:58:52','2026-01-21 10:08:48'),(4,'AI_Image_21012026_16_33_14_719.jpeg','uploads\\images\\AI_Image_21012026_16_33_14_719.jpeg','Unveiling my stunning new ride! ✨ This beauty is everything I dreamed of, sleek and ready for amazing adventures. Feeling those luxury vibes! ?? #NewCar #LuxuryLife #DreamCar #CarGoals #FreshWheels','pending',NULL,'2026-01-21 11:03:14','2026-01-21 11:03:14'),(5,'AI_Image_21012026_16_33_37_507.jpeg','uploads\\images\\AI_Image_21012026_16_33_37_507.jpeg','Just unveiled this beauty! ? So excited about the sleek lines and incredible power of this new ride. Ready to hit the road in style! ✨ #NewCar #LuxuryLife #DreamRide #CarGoals #FreshWheels','approved','{\"twitter\": 0, \"facebook\": 1, \"linkedin\": 0, \"instagram\": 0}','2026-01-21 11:03:37','2026-01-21 11:04:25');
/*!40000 ALTER TABLE `generated_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21 16:51:27
