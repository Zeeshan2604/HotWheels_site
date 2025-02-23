router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      // ... other fields
      model3D: product.model3D
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); 