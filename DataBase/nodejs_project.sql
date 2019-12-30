-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2019 at 07:36 AM
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
-- Database: `nodejs_project`
--
CREATE DATABASE IF NOT EXISTS `nodejs_project` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nodejs_project`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `insertintousers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertintousers` (IN `username` VARCHAR(50), IN `password` VARCHAR(100), IN `fullname` VARCHAR(100), IN `role` VARCHAR(10))  INSERT INTO users
(users.username,users.password,users.fullname,users.role)
values (username,password,fullname , role)$$

DROP PROCEDURE IF EXISTS `selectfromusers`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `selectfromusers` (IN `username` VARCHAR(50))  select
users.username , users.password , users.fullname , users.role
FROM users 
WHERE users.username = username$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
