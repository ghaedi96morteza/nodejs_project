-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2019 at 08:13 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_exercise03`
--
CREATE DATABASE IF NOT EXISTS `nodejs_exercise03` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `nodejs_exercise03`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `InsertIntoUsers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertIntoUsers` (IN `username` VARCHAR(50), IN `password` VARCHAR(200))  INSERT INTO users (users.username , users.password) VALUES(username , password)$$

DROP PROCEDURE IF EXISTS `SelectFromUsers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `SelectFromUsers` (IN `username` VARCHAR(50), IN `password` VARCHAR(200))  SELECT * FROM users
WHERE users.username = username AND users.password = password$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(200) CHARACTER SET utf8 NOT NULL,
  `role` char(10) DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
