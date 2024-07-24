-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Lug 24, 2024 alle 11:51
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
  `IDAdmin` int(10) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `oauth_provider` enum('google','facebook','twitter','linkedin') DEFAULT 'google',
  `oauth_uid` varchar(50) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `admin`
--

INSERT INTO `admin` (`IDAdmin`, `first_name`, `last_name`, `email`, `picture`, `oauth_provider`, `oauth_uid`, `created`, `modified`) VALUES
(0, 'admin', 'admin', 'admin@gmail.com', NULL, 'google', '0000', '2024-07-23 15:20:48', '2024-07-23 15:20:48'),
(1, 'Daniele', NULL, 'danidavo05@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocKnRP3zPTJUOFJlu6EgvXl2OPZKTLIIJ4Yg7hfP6KQqujJXalk6=s96-c', 'google', '106736980995399353077', '2024-07-22 23:35:15', '2024-07-22 23:35:15'),
(2, 'Daniele', NULL, 'davoli.daniele@darzo.net', 'https://lh3.googleusercontent.com/a/ACg8ocI4UUA3cPcflksmkva_PUgoU2yQRI4G3KWeGEz9v_xz3hhMFek=s96-c', 'google', '112203254225122570177', '2024-07-22 23:37:57', '2024-07-22 23:37:57');

-- --------------------------------------------------------

--
-- Struttura della tabella `listeutenti`
--

CREATE TABLE `listeutenti` (
  `IDLista` int(11) NOT NULL,
  `Data_ora_ingresso` datetime NOT NULL,
  `Data_ora_uscita` datetime NOT NULL,
  `IDUtente` int(11) DEFAULT NULL,
  `IDRiunione` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `listeutenti`
--

INSERT INTO `listeutenti` (`IDLista`, `Data_ora_ingresso`, `Data_ora_uscita`, `IDUtente`, `IDRiunione`) VALUES
(4, '2024-07-23 16:03:08', '0000-00-00 00:00:00', 1, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `riunioni`
--

CREATE TABLE `riunioni` (
  `IDRiunione` int(10) NOT NULL,
  `IDRoom` varchar(100) DEFAULT NULL,
  `Titolo` varchar(100) NOT NULL,
  `Descrizione` varchar(1000) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `TVStatus` enum('true','false') DEFAULT 'true',
  `DataInizio` datetime NOT NULL,
  `DataFine` datetime DEFAULT NULL,
  `IDAdmin` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `riunioni`
--

INSERT INTO `riunioni` (`IDRiunione`, `IDRoom`, `Titolo`, `Descrizione`, `Password`, `TVStatus`, `DataInizio`, `DataFine`, `IDAdmin`) VALUES
(0, '0', 'PROVA', 'Descrizione di Prova', '00000', 'true', '2024-07-31 10:46:35', NULL, 0),
(11, '49IDOkPiInMhIc2wYsm7Y-Ndu4zoXmyi', 'tete', 'tete', '78966', 'false', '0000-00-00 00:00:00', '2024-07-24 10:56:58', 2),
(12, '4wWPJXSWNHcoKjZGnAZqHRn4RswAKmrT', 'sss', 'sss', '40949', 'true', '2024-07-24 10:57:57', '2024-07-24 10:58:14', 1),
(18, '8vo5O1-MMqsWb9G2vBVzHXni9cXOWzmG', 'dada', 'dada', '78966', 'true', '2024-07-24 11:22:47', NULL, 2);

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `riunioni_attive`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `riunioni_attive` (
`IDRiunione` int(10)
,`IDRoom` varchar(100)
,`Titolo` varchar(100)
,`Descrizione` varchar(1000)
,`Password` varchar(100)
,`TVStatus` enum('true','false')
,`DataInizio` datetime
,`DataFine` datetime
,`IDAdmin` int(10)
);

-- --------------------------------------------------------

--
-- Struttura stand-in per le viste `storico_riunioni`
-- (Vedi sotto per la vista effettiva)
--
CREATE TABLE `storico_riunioni` (
`IDRiunione` int(10)
,`IDRoom` varchar(100)
,`Titolo` varchar(100)
,`Descrizione` varchar(1000)
,`Password` varchar(100)
,`TVStatus` enum('true','false')
,`DataInizio` datetime
,`DataFine` datetime
,`IDAdmin` int(10)
);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(20) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `oauth_uid` int(30) NOT NULL,
  `oauth_provider` enum('google','facebook','twitter','linkedin') NOT NULL DEFAULT 'google',
  `picture` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `first_name`, `email`, `oauth_uid`, `oauth_provider`, `picture`, `created`, `modified`) VALUES
(1, 'Daniele', 'davoli.daniele@darzo.net', 2147483647, 'google', 'https://lh3.googleusercontent.com/a/ACg8ocI4UUA3cPcflksmkva_PUgoU2yQRI4G3KWeGEz9v_xz3hhMFek=s96-c', '2024-07-05 10:13:29', '2024-07-24 11:49:58'),
(2, 'Nicole', 'padulese.nicole@darzo.net', 2147483647, 'google', 'https://lh3.googleusercontent.com/a/ACg8ocLHrzfmyzMyyw96kDQ1E_8gMsAi72hrCFP0LVXex0WsWuHSvw=s96-c', '2024-07-05 14:35:56', '2024-07-05 14:35:56'),
(3, 'Rita', 'danydavo05@gmail.com', 2147483647, 'google', 'https://lh3.googleusercontent.com/a/ACg8ocLtu0s3U4ZPsDEIbtdxyAQR_HAPasUpkvIfbzLOtUb9Ypu3KA=s96-c', '2024-07-05 14:59:16', '2024-07-05 14:59:37'),
(4, 'Daniele', 'danidavo05@gmail.com', 2147483647, 'google', 'https://lh3.googleusercontent.com/a/ACg8ocKnRP3zPTJUOFJlu6EgvXl2OPZKTLIIJ4Yg7hfP6KQqujJXalk6=s96-c', '2024-07-22 23:26:44', '2024-07-24 10:57:54');

-- --------------------------------------------------------

--
-- Struttura per vista `riunioni_attive`
--
DROP TABLE IF EXISTS `riunioni_attive`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `riunioni_attive`  AS   (select `riunioni`.`IDRiunione` AS `IDRiunione`,`riunioni`.`IDRoom` AS `IDRoom`,`riunioni`.`Titolo` AS `Titolo`,`riunioni`.`Descrizione` AS `Descrizione`,`riunioni`.`Password` AS `Password`,`riunioni`.`TVStatus` AS `TVStatus`,`riunioni`.`DataInizio` AS `DataInizio`,`riunioni`.`DataFine` AS `DataFine`,`riunioni`.`IDAdmin` AS `IDAdmin` from `riunioni` where `riunioni`.`DataFine` is null)  ;

-- --------------------------------------------------------

--
-- Struttura per vista `storico_riunioni`
--
DROP TABLE IF EXISTS `storico_riunioni`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `storico_riunioni`  AS   (select `riunioni`.`IDRiunione` AS `IDRiunione`,`riunioni`.`IDRoom` AS `IDRoom`,`riunioni`.`Titolo` AS `Titolo`,`riunioni`.`Descrizione` AS `Descrizione`,`riunioni`.`Password` AS `Password`,`riunioni`.`TVStatus` AS `TVStatus`,`riunioni`.`DataInizio` AS `DataInizio`,`riunioni`.`DataFine` AS `DataFine`,`riunioni`.`IDAdmin` AS `IDAdmin` from `riunioni` where `riunioni`.`DataFine` is not null)  ;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`IDAdmin`);

--
-- Indici per le tabelle `listeutenti`
--
ALTER TABLE `listeutenti`
  ADD PRIMARY KEY (`IDLista`),
  ADD KEY `IDUtente` (`IDUtente`),
  ADD KEY `IDRiunione` (`IDRiunione`);

--
-- Indici per le tabelle `riunioni`
--
ALTER TABLE `riunioni`
  ADD PRIMARY KEY (`IDRiunione`),
  ADD KEY `IDAdmin` (`IDAdmin`);

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
  MODIFY `IDAdmin` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `listeutenti`
--
ALTER TABLE `listeutenti`
  MODIFY `IDLista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `riunioni`
--
ALTER TABLE `riunioni`
  MODIFY `IDRiunione` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `listeutenti`
--
ALTER TABLE `listeutenti`
  ADD CONSTRAINT `listeutenti_ibfk_1` FOREIGN KEY (`IDUtente`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `listeutenti_ibfk_2` FOREIGN KEY (`IDRiunione`) REFERENCES `riunioni` (`IDRiunione`);

--
-- Limiti per la tabella `riunioni`
--
ALTER TABLE `riunioni`
  ADD CONSTRAINT `riunioni_ibfk_1` FOREIGN KEY (`IDAdmin`) REFERENCES `admin` (`IDAdmin`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
