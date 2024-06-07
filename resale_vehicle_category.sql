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
-- Table structure for table `resale_vehicle_category`
--

CREATE TABLE `resale_vehicle_category` (
  `id` int NOT NULL,
  `category_name` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `resale_vehicle_category`
--

INSERT INTO `resale_vehicle_category` (`id`, `category_name`) VALUES
(1, 'Car'),
(2, 'Bike/Motorcycle'),
(3, 'Scooter'),
(4, 'Plane'),
(6, 'Taxi'),
(7, 'Truck'),
(8, 'Bus'),
(9, 'Tractor'),
(10, 'Electric_Car');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `resale_vehicle_category`
--
ALTER TABLE `resale_vehicle_category`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resale_vehicle_category`
--
ALTER TABLE `resale_vehicle_category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
