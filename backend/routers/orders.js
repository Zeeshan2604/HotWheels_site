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

router.post(`/`, authJwt(), async (req, res) => {
  try {
    const order = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: {
        address: req.body.shippingAddress.address,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state,
        zip: req.body.shippingAddress.zip,
        country: req.body.shippingAddress.country,
        phone: req.body.shippingAddress.phone
      },
      totalPrice: req.body.totalPrice,
      user: req.auth.userId,
      status: 'Pending'
    });

    const savedOrder = await order.save();
    res.status(201).send(savedOrder);
  } catch (error) {
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
