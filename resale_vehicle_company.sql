-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 07, 2024 at 07:10 AM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `redis-mysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `resale_vehicle_company`
--

CREATE TABLE `resale_vehicle_company` (
  `id` int NOT NULL,
  `resale_vehicle_category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_update` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `resale_vehicle_company`
--

INSERT INTO `resale_vehicle_company` (`id`, `resale_vehicle_category_id`, `name`, `is_update`) VALUES
(1, 1, 'Maruti Suzuki', 0),
(2, 1, 'Hyundai', 0),
(3, 1, 'Tata', 0),
(4, 1, 'Mahindra', 0),
(5, 1, 'Honda', 0),
(6, 1, 'Toyota', 0),
(7, 1, 'Ford', 0),
(8, 1, 'Volkswagen', 0),
(9, 1, 'Arash', 0),
(10, 1, 'Ashok Leyland', 0),
(11, 1, 'Aston Martin', 0),
(12, 1, 'Audi', 0),
(13, 1, 'Bajaj', 0),
(14, 1, 'Bentley', 0),
(15, 1, 'BMW', 0),
(16, 1, 'Brabus', 0),
(17, 1, 'Bugatti', 0),
(18, 1, 'Chevrolet', 0),
(19, 1, 'Chrysler', 0),
(20, 1, 'Citroen', 0),
(21, 1, 'Datsun', 0),
(22, 1, 'DC', 0),
(23, 1, 'Ferrari', 0),
(24, 1, 'Fiat', 0),
(25, 1, 'Force', 0),
(26, 1, 'HM', 0),
(27, 1, 'Hummer', 0),
(28, 1, 'ICML', 0),
(29, 1, 'Isuzu', 0),
(30, 1, 'Jaguar', 0),
(31, 1, 'Jeep', 0),
(32, 1, 'Kia', 0),
(33, 1, 'Lamborghini', 0),
(34, 1, 'Land Rover', 0),
(35, 1, 'Lexus', 0),
(36, 1, 'Mahindra Renault', 0),
(37, 1, 'Mahindra Ssangyong', 0),
(38, 1, 'Maserati', 0),
(39, 1, 'Maybach', 0),
(40, 1, 'McLaren', 0),
(41, 1, 'Mercedes-Benz', 0),
(42, 1, 'MG', 0),
(43, 1, 'MINI', 0),
(44, 1, 'Mitsubishi', 0),
(45, 1, 'Nissan', 0),
(46, 1, 'Porsche', 0),
(47, 1, 'Premier', 0),
(48, 1, 'Renault', 0),
(49, 1, 'Rolls-Royce', 0),
(50, 1, 'San', 0),
(51, 1, 'Skoda', 0),
(52, 1, 'Volvo', 0),
(128, 2, 'QJ Motor', 0),
(127, 2, 'Norton', 0),
(126, 2, 'MV Agusta', 0),
(125, 2, 'Moto Morini', 0),
(124, 2, 'Moto Guzzi', 0),
(123, 2, 'Mahindra', 0),
(122, 2, 'Lml', 0),
(121, 2, 'KTM', 0),
(120, 2, 'Keeway', 0),
(119, 2, 'Kawasaki', 0),
(118, 2, 'Jawa', 0),
(117, 2, 'Indian', 0),
(116, 2, 'Hyosung', 0),
(115, 2, 'Husqvarna', 0),
(114, 2, 'Harley-Davidson', 0),
(113, 2, 'Global Automobiles', 0),
(112, 2, 'FB Mondial', 0),
(111, 2, 'Eider', 0),
(110, 2, 'Ducati', 0),
(109, 2, 'CFMoto', 0),
(108, 2, 'Carberry', 0),
(107, 2, 'BMW', 0),
(106, 2, 'Benelli', 0),
(105, 2, 'Avantura Choppers', 0),
(104, 2, 'Aprilia', 0),
(103, 2, 'Yamaha', 0),
(102, 2, 'TVS', 0),
(101, 2, 'Suzuki', 0),
(100, 2, 'Royal Enfield', 0),
(99, 2, 'Honda', 0),
(98, 2, 'Hero', 0),
(97, 2, 'Bajaj', 0),
(129, 2, 'Regal Raptor', 0),
(130, 2, 'Triumph', 0),
(131, 2, 'UM', 0),
(132, 2, 'Yezdi', 0),
(133, 2, 'Zontes', 0),
(134, 3, 'Honda', 0),
(135, 3, 'Hero', 0),
(136, 3, 'TVS', 0),
(137, 3, 'Yamaha', 0),
(138, 3, 'Suzuki', 0),
(139, 3, 'Aprilia', 0),
(140, 3, 'Bajaj', 0),
(141, 3, 'BMW', 0),
(142, 3, 'Keeway', 0),
(143, 3, 'Kinetic', 0),
(144, 3, 'Lml', 0),
(145, 3, 'Mahindra', 0),
(146, 3, 'MKB', 0),
(147, 3, 'Motionman', 0),
(148, 3, 'Piaggio', 0),
(149, 3, 'Sincero', 0),
(150, 3, 'Tunwal', 0),
(151, 3, 'Ved Motors', 0),
(152, 3, 'Virtue', 0),
(153, 3, 'White Carbon', 0),
(154, 7, 'AMW', 0),
(155, 7, 'Ashok Leyland', 0),
(156, 7, 'ATUL', 0),
(157, 7, 'Bajaj', 0),
(158, 7, 'Bajaj RE', 0),
(159, 7, 'Bharat Benz', 0),
(160, 7, 'Eicher', 0),
(161, 7, 'Force', 0),
(162, 7, 'Hino', 0),
(163, 7, 'Isuzu', 0),
(164, 7, 'Kamaz', 0),
(165, 7, 'Kinetic', 0),
(166, 7, 'Lohia', 0),
(167, 7, 'Mahindra', 0),
(168, 7, 'Man', 0),
(169, 7, 'Maruti Suzuki', 0),
(170, 7, 'Piaggio', 0),
(171, 7, 'Scania', 0),
(172, 7, 'SML Isuzu', 0),
(173, 7, 'Tata', 0),
(174, 7, 'Volvo', 0),
(175, 8, 'Ashok Leyland', 0),
(176, 8, 'Bharat Benz', 0),
(177, 8, 'Eicher', 0),
(178, 8, 'Force', 0),
(179, 8, 'Force Motors', 0),
(180, 8, 'JBM', 0),
(181, 8, 'Mahindra', 0),
(182, 8, 'Scania', 0),
(183, 8, 'SML Isuzu', 0),
(184, 8, 'Tata', 0),
(185, 8, 'Volvo', 0),
(186, 9, 'Ace', 0),
(187, 9, 'Angad', 0),
(188, 9, 'Captain', 0),
(189, 9, 'CASE', 0),
(190, 9, 'Digitrac', 0),
(191, 9, 'Eicher', 0),
(192, 9, 'Escorts', 0),
(193, 9, 'Farmtrac', 0),
(194, 9, 'Force', 0),
(195, 9, 'Hyundai', 0),
(196, 9, 'Indo Farm', 0),
(197, 9, 'JCB', 0),
(198, 9, 'John Deere', 0),
(199, 9, 'Kobelco', 0),
(200, 9, 'Komatsu', 0),
(201, 9, 'Kubota', 0),
(202, 9, 'L&T', 0),
(203, 9, 'Mahindra', 0),
(204, 9, 'Massey Ferguson', 0),
(205, 9, 'New Holland', 0),
(206, 9, 'Preet', 0),
(207, 9, 'Same Deutz Fahr', 0),
(208, 9, 'SANY', 0),
(209, 9, 'SDF', 0),
(210, 9, 'Solis', 0),
(211, 9, 'Sonalika', 0),
(212, 9, 'Standard', 0),
(213, 9, 'Swaraj', 0),
(214, 9, 'Tafe', 0),
(215, 9, 'Tata Hitachi', 0),
(216, 9, 'Trakstar', 0),
(217, 9, 'VST Shakti', 0),
(218, 9, 'Zetor', 0),
(219, 10, 'Audi', 0),
(220, 10, 'BMW', 0),
(221, 10, 'BYD', 0),
(222, 10, 'Citroen', 0),
(223, 10, 'Hyundai', 0),
(224, 10, 'Jaguar', 0),
(225, 10, 'Kia', 0),
(226, 10, 'Mahindra', 0),
(227, 10, 'Mercedes-Benz', 0),
(228, 10, 'MG', 0),
(229, 10, 'MINI', 0),
(230, 10, 'PMV', 0),
(231, 10, 'Porsche', 0),
(232, 10, 'Pravaig', 0),
(233, 10, 'Tata', 0),
(234, 6, 'Maruti Suzuki', 0),
(235, 6, 'Hyundai', 0),
(236, 6, 'Tata', 0),
(237, 6, 'Mahindra', 0),
(238, 6, 'Honda', 0),
(239, 6, 'Toyota', 0),
(240, 6, 'Ford', 0),
(241, 6, 'Volkswagen', 0),
(242, 6, 'Arash', 0),
(243, 6, 'Ashok Leyland', 0),
(244, 6, 'Aston Martin', 0),
(245, 6, 'Audi', 0),
(246, 6, 'Bajaj', 0),
(247, 6, 'Bentley', 0),
(248, 6, 'BMW', 0),
(249, 6, 'Brabus', 0),
(250, 6, 'Bugatti', 0),
(251, 6, 'Chevrolet', 0),
(252, 6, 'Chrysler', 0),
(253, 6, 'Citroen', 0),
(254, 6, 'Datsun', 0),
(255, 6, 'DC', 0),
(256, 6, 'Ferrari', 0),
(257, 6, 'Fiat', 0),
(258, 6, 'Force', 0),
(259, 6, 'HM', 0),
(260, 6, 'Hummer', 0),
(261, 6, 'ICML', 0),
(262, 6, 'Isuzu', 0),
(263, 6, 'Jaguar', 0),
(264, 6, 'Jeep', 0),
(265, 6, 'Kia', 0),
(266, 6, 'Lamborghini', 0),
(267, 6, 'Land Rover', 0),
(268, 6, 'Lexus', 0),
(269, 6, 'Mahindra Renault', 0),
(270, 6, 'Mahindra Ssangyong', 0),
(271, 6, 'Maserati', 0),
(272, 6, 'Maybach', 0),
(273, 6, 'McLaren', 0),
(274, 6, 'Mercedes-Benz', 0),
(275, 6, 'MG', 0),
(276, 6, 'MINI', 0),
(277, 6, 'Mitsubishi', 0),
(278, 6, 'Nissan', 0),
(279, 6, 'Porsche', 0),
(280, 6, 'Premier', 0),
(281, 6, 'Renault', 0),
(282, 6, 'Rolls-Royce', 0),
(283, 6, 'San', 0),
(284, 6, 'Skoda', 0),
(285, 6, 'Volvo', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `resale_vehicle_company`
--
ALTER TABLE `resale_vehicle_company`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resale_vehicle_company`
--
ALTER TABLE `resale_vehicle_company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
