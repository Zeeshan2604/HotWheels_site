import { User } from "../models/user.js";
import { Router } from "express";
import bcrypt from "bcryptjs";
import pkg from 'jsonwebtoken';
import { Types } from "mongoose";
import express from 'express';
import authJwt from '../helpers/jwt.js';

const { hashSync, compareSync } = bcrypt;
const router = Router();
const { sign } = pkg;

//get all users
router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    // const userList = await User.find().select("name email phone");

    if (!userList) {
      return res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get single user
router.get("/:id", async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID");
    }

    const user = await User.findById(req.params.id).select("-passwordHash");
    // const user = await User.findById(req.params.id).select("name email phone");

    if (!user) {
      return res
        .status(500)
        .json({ message: "The user with the given Id was not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.send({ count: userCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//create a user for admin use
router.post(`/`, async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      color: req.body.color,
      passwordHash: hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    if (!user) return res.status(404).send("The user cannot be registered!");

    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//login using email and password
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User not found!");
    }

    if (user && compareSync(req.body.password, user.passwordHash)) {
      const token = sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("Login successful for user:", user.email);
      return res.status(200).send({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          street: user.street,
          apartment: user.apartment,
          city: user.city,
          zip: user.zip,
          country: user.country,
          isAdmin: user.isAdmin
        }, 
        token: token 
      });
    } else {
      console.log("Invalid password for user:", user.email);
      return res.status(400).send("Password is incorrect!");
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("An error occurred during login.");
  }
});

//register a user
router.post(`/register`, async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      color: req.body.color,
      passwordHash: hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    if (!user) return res.status(404).send("The user cannot be registered!");

    const token = sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        street: user.street,
        apartment: user.apartment,
        city: user.city,
        zip: user.zip,
        country: user.country,
        isAdmin: user.isAdmin
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//delete a user
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user was not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//update user details
router.put('/:id', authJwt(), async (req, res) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        // Ensure user can only update their own profile
        if (req.auth.userId !== req.params.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this profile' 
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                street: user.street,
                apartment: user.apartment,
                city: user.city,
                zip: user.zip,
                country: user.country
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

export default router;
