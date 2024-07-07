-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Lug 07, 2024 alle 11:14
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agorà`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `oauth_provider` enum('google','facebook','twitter','linkedin') NOT NULL DEFAULT 'google',
  `oauth_uid` varchar(50) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `admin`
--

INSERT INTO `admin` (`id`, `oauth_provider`, `oauth_uid`, `first_name`, `email`, `picture`, `created`, `modified`) VALUES
(1, 'google', '106736980995399353077', 'Daniele', 'danidavo05@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocKnRP3zPTJUOFJlu6EgvXl2OPZKTLIIJ4Yg7hfP6KQqujJXalk6=s96-c', '2024-07-05 10:12:47', '2024-07-05 10:12:47');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(20) NOT NULL,
  `oauth_uid` int(30) NOT NULL,
  `oauth_provider` enum('google','facebook','twitter','linkedin') NOT NULL DEFAULT 'google',
  `first_name` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `oauth_uid`, `oauth_provider`, `first_name`, `email`, `picture`, `created`, `modified`) VALUES
(1, 2147483647, 'google', 'Daniele', 'davoli.daniele@darzo.net', 'https://lh3.googleusercontent.com/a/ACg8ocI4UUA3cPcflksmkva_PUgoU2yQRI4G3KWeGEz9v_xz3hhMFek=s96-c', '2024-07-05 10:13:29', '2024-07-05 15:23:42'),
(2, 2147483647, 'google', 'Nicole', 'padulese.nicole@darzo.net', 'https://lh3.googleusercontent.com/a/ACg8ocLHrzfmyzMyyw96kDQ1E_8gMsAi72hrCFP0LVXex0WsWuHSvw=s96-c', '2024-07-05 14:35:56', '2024-07-05 14:35:56'),
(3, 2147483647, 'google', 'Rita', 'danydavo05@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLtu0s3U4ZPsDEIbtdxyAQR_HAPasUpkvIfbzLOtUb9Ypu3KA=s96-c', '2024-07-05 14:59:16', '2024-07-05 14:59:37');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
