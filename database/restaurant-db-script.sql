SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
-- Database: `restaurant_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `description`, `price`, `category`, `imageUrl`, `isAvailable`, `createdAt`, `updatedAt`) VALUES
(2, 'Margherita Pizza', 'daddwa', 33.00, 'Pizza', '\\uploads\\menu_images\\imageUrl-1763844289878.jpg', 1, '2025-11-22 20:44:49', '2025-11-22 20:44:49'),
(3, 'dsad', 'asdsadsa', 22.00, 'Pizza', '\\uploads\\menu_images\\imageUrl-1763845204148.jpg', 1, '2025-11-22 21:00:04', '2025-11-22 21:00:04'),
(4, 'check', '121', 33.00, 'Pizza', '\\uploads\\menu_images\\imageUrl-1763845243197.PNG', 1, '2025-11-22 21:00:43', '2025-11-22 21:00:43'),
(5, 'pasta', 'pasta', 18.00, 'Pasta', '\\uploads\\menu_images\\imageUrl-1763887998199.PNG', 1, '2025-11-23 08:53:18', '2025-11-23 08:53:18');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `menuId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `priceAtOrder` decimal(10,2) NOT NULL COMMENT 'Snapshot of the item price at the moment of order',
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`id`, `orderId`, `menuId`, `quantity`, `priceAtOrder`, `subtotal`) VALUES
(1, 1, 3, 1, 22.00, 22.00),
(2, 2, 4, 1, 33.00, 33.00),
(3, 3, 4, 1, 33.00, 33.00),
(4, 4, 3, 1, 22.00, 22.00),
(5, 5, 2, 1, 33.00, 33.00),
(6, 6, 3, 1, 22.00, 22.00),
(7, 7, 3, 1, 22.00, 22.00),
(8, 8, 5, 2, 18.00, 36.00),
(9, 9, 2, 2, 33.00, 66.00),
(10, 10, 2, 1, 33.00, 33.00),
(11, 10, 3, 1, 22.00, 22.00),
(12, 10, 4, 1, 33.00, 33.00),
(13, 11, 2, 1, 33.00, 33.00),
(14, 11, 3, 1, 22.00, 22.00),
(15, 11, 4, 1, 33.00, 33.00),
(16, 12, 2, 1, 33.00, 33.00),
(17, 12, 3, 1, 22.00, 22.00),
(18, 12, 4, 1, 33.00, 33.00),
(19, 13, 2, 1, 33.00, 33.00),
(20, 13, 3, 1, 22.00, 22.00),
(21, 13, 4, 1, 33.00, 33.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Processing','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `totalAmount`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 22.00, 'Cancelled', '2025-11-23 06:34:01', '2025-11-23 06:34:16'),
(2, 2, 33.00, 'Cancelled', '2025-11-23 06:34:37', '2025-11-23 08:24:25'),
(3, 2, 33.00, 'Cancelled', '2025-11-23 06:45:45', '2025-11-23 08:37:45'),
(4, 2, 22.00, 'Cancelled', '2025-11-23 06:46:01', '2025-11-23 08:37:41'),
(5, 2, 33.00, 'Cancelled', '2025-11-23 08:04:06', '2025-11-23 08:37:44'),
(6, 2, 22.00, 'Cancelled', '2025-11-23 08:18:46', '2025-11-23 08:37:43'),
(7, 2, 22.00, 'Pending', '2025-11-23 08:39:06', '2025-11-23 08:39:06'),
(8, 2, 36.00, 'Delivered', '2025-11-23 08:53:43', '2025-11-23 20:54:53'),
(9, 3, 66.00, 'Pending', '2025-11-23 18:11:53', '2025-11-23 18:11:53'),
(10, 2, 88.00, 'Pending', '2025-11-23 18:56:23', '2025-11-23 18:56:23'),
(11, 2, 88.00, 'Cancelled', '2025-11-23 20:02:08', '2025-11-23 20:54:47'),
(12, 2, 88.00, 'Delivered', '2025-11-23 20:09:33', '2025-11-23 20:54:29'),
(13, 2, 88.00, 'Pending', '2025-11-23 22:14:11', '2025-11-23 22:14:11');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `paymentMethod` enum('Credit Card','COD','PayPal') NOT NULL,
  `amountPaid` decimal(10,2) NOT NULL,
  `status` enum('Success','Failed','Pending') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `numberOfGuests` int(11) NOT NULL,
  `reservationTime` datetime NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('Confirmed','Seated','Cancelled') NOT NULL DEFAULT 'Confirmed',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin@test.com', '$2b$10$ctFLL9DQdgK.hK8MfJSgCe9jewMqm7ho/LXsASfwMBb8GgElpUSru', 'admin', '2025-11-22 20:00:15', '2025-11-22 20:00:15'),
(2, 'admin1', 'admin1@test.com', '$2b$10$2T0FgjvgbEns57/WHrMIAOf0f1Q/go/RRy5l/wIqu4Pr0vvXT8wKi', 'admin', '2025-11-22 20:05:50', '2025-11-22 20:05:50'),
(3, 'customer', 'customer@test.com', '$2b$10$Ldkd7cQT/VlYl/Q8ajCnmuu5B9M5KtOZXwhP0keut6guYm74nKmgq', 'customer', '2025-11-23 18:11:12', '2025-11-23 18:11:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `menuId` (`menuId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderId` (`orderId`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_4` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
