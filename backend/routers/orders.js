import { Order } from "../models/order.js";
import { Router } from "express";
import { OrderItem } from "../models/order-item.js";
import authJwt from "../helpers/jwt.js";
const router = Router();

router.get('/user', authJwt(), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.auth.userId })
      .sort({ dateOrdered: -1 })
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name price image'
        }
      });
    res.send(orders);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name ")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

//get the total orders count
router.get(`/get/count`, async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.send({ count: orderCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//to get the totalsales
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.send({ count: orderCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

////get a users all orders
router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

///
///     post request
///

// Function to generate a unique order number
const generateOrderNumber = async () => {
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    console.log("Last Order:", lastOrder); // Log the last order retrieved

    // If there is no last order, start with order number 1
    const lastOrderNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber : 0;
    const newOrderNumber = lastOrderNumber + 1; // Increment the last order number

    // Ensure the new order number is a valid number
    if (isNaN(newOrderNumber) || newOrderNumber <= 0) {
        throw new Error("Invalid order number generated");
    }

    return newOrderNumber; // Return the new order number
};

// Create a new order
router.post(`/`, authJwt(), async (req, res) => {
    try {
        const orderNumber = await generateOrderNumber(); // Generate unique order number
        console.log("Generated Order Number:", orderNumber); // Log the generated order number
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            totalPrice: req.body.totalPrice,
            user: req.auth.userId,
            orderNumber: orderNumber, // Set the generated order number
            status: 'Pending'
        });

        const savedOrder = await order.save();
        res.status(201).send(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error); // Log the error
        res.status(400).json({ success: false, error: error.message });
    }
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) return res.status(404).send("The order cannot be updated!");

  res.send(order);
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order was not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

export default router;
