DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `userUid` int NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `FK1_USER_UID` (`userUid`),
  CONSTRAINT `FK1_USER_UID` FOREIGN KEY (`userUid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `userUid` int DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `day` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `FK1_USER_UID1` (`userUid`),
  CONSTRAINT `FK1_USER_UID1` FOREIGN KEY (`userUid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `userUid` int NOT NULL,
  `linkUid` int NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `FK1_USER_UID2` (`userUid`),
  KEY `FK2_LINK_UID` (`linkUid`),
  CONSTRAINT `FK1_USER_UID2` FOREIGN KEY (`userUid`) REFERENCES `users` (`uid`),
  CONSTRAINT `FK2_LINK_UID` FOREIGN KEY (`linkUid`) REFERENCES `links` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `links`;
CREATE TABLE `links` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `url` text,
  `image` text,
  `tag` varchar(200) DEFAULT NULL,
  `field` varchar(200) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(200) DEFAULT NULL,
  `password` text,
  `email` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `signUpPath` varchar(200) DEFAULT NULL,
  `points` int NOT NULL DEFAULT '0',
  `regiTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `forgetPwdStatus` varchar(20) NOT NULL,
  `passwordSalt` varchar(200) DEFAULT NULL,
  `temporaryPassword` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
