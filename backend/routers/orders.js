import { Order } from "../models/order.js";
import { Router } from "express";
import { OrderItem } from "../models/order-item.js";
const router = Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find().populate("user", "name ");
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
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

router.post(`/`, async (req, res) => {
  try {
    // create orderItems and place in db
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItems) => {
        let newOrderItem = new OrderItem({
          quantity: orderItems.quantity,
          product: orderItems.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id; // Convert ObjectId to string
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    //calculate the total price of a single product including quantities
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    console.log(totalPrices);

    //create an order with all the orderItems and their quantities
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    order = await order.save();

    if (!order) return res.status(404).send("The order cannot be created!");

    res.send(order);
  } catch (err) {
    res.status(500).send(err.message);
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
