-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.4.17-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- darlink 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `darlink` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `darlink`;

-- 테이블 darlink.admin 구조 내보내기
CREATE TABLE IF NOT EXISTS `admin` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `FK1_USER_UID` (`user_uid`),
  CONSTRAINT `FK1_USER_UID` FOREIGN KEY (`user_uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 darlink.attendance 구조 내보내기
CREATE TABLE IF NOT EXISTS `attendance` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `user_uid` int(11) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `day` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `FK1_USER_UID1` (`user_uid`),
  CONSTRAINT `FK1_USER_UID1` FOREIGN KEY (`user_uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 darlink.links 구조 내보내기
CREATE TABLE IF NOT EXISTS `links` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `url` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `tag` varchar(200) DEFAULT NULL,
  `likeNum` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 darlink.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(200) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `signUpPath` varchar(200) DEFAULT NULL,
  `likes` mediumtext DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `regiTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
