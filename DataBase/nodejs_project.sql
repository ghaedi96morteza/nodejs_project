-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 09, 2020 at 01:19 AM
-- Server version: 8.0.18
-- PHP Version: 7.3.11

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
CREATE DATABASE IF NOT EXISTS `nodejs_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `nodejs_project`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `insert_into_comments`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_into_comments` (IN `body` TEXT, IN `pid` INT, IN `uid` INT, IN `author` VARCHAR(100))  INSERT INTO comments
(comments.body,comments.postid,comments.userid,comments.author)
VALUES(body,pid,uid,author)$$

DROP PROCEDURE IF EXISTS `insert_into_posts`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_into_posts` (IN `uid` INT(11), IN `body` TEXT, IN `dir` VARCHAR(200), IN `title` VARCHAR(50), IN `author` VARCHAR(100))  INSERT INTO posts
(posts.body, posts.file_dir, posts.userid, posts.title,posts.author)
VALUES (body, dir, uid, title,author)$$

DROP PROCEDURE IF EXISTS `insert_into_users`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_into_users` (IN `uname` VARCHAR(50), IN `pass` VARCHAR(200), IN `fname` VARCHAR(200), IN `role` CHAR(10))  INSERT INTO 
users
(users.username, users.password, users.role, users.fullname)
VALUES 
(uname, pass, role, fname)$$

DROP PROCEDURE IF EXISTS `select_from_users`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `select_from_users` (IN `uname` VARCHAR(50))  SELECT *
FROM users
WHERE users.username = uname$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `body` text COLLATE utf8mb4_general_ci,
  `author` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `postid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `postid` (`postid`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `body`, `author`, `postid`, `userid`) VALUES
(13, 'نظر شماره 1', 'حمید بابایی', 6, 5),
(14, 'نظر شماره 2', 'حمید بابایی', 6, 5),
(15, 'نظر شماره 3', 'حمید بابایی', 6, 5),
(16, 'نظر برای تمرین 2', 'رضا اسدی', 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `body` text COLLATE utf8mb4_general_ci,
  `author` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `file_dir` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `body`, `author`, `file_dir`, `userid`) VALUES
(4, 'تمرین شماره 1', 'متن شماره 1', 'حمید بابایی', 'files/hamid/ArrayXSequence.m', 5),
(5, 'تمرین شماره 2', 'متن شماره 2', 'حمید بابایی', 'files/hamid/ArrayXSequence.m', 5),
(6, 'تمرین شماره 3', 'متن شماره 3', 'حمید بابایی', 'files/hamid/ArrayXSequence.m', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `role` char(10) COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `fullname`) VALUES
(4, 'reza', '$2b$10$oj6PR8E1XQu0SwaQ85X1Ju3L5Lfk9.U7IjxSntaD/4jESq4qnjCsW', 'دانشجو', 'رضا اسدی'),
(5, 'hamid', '$2b$10$l7G8vRLcXWkZu.SfnFMdjOpxwcZs/vxc.ZXvIMVhtvH5Z7O7R/t1.', 'استاد', 'حمید بابایی');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postid`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
