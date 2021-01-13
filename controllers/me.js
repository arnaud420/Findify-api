module.exports = {
  me: async (req, res) => {
    try {
      const data = req.currentUser;
      res.json({ success: true, data: data || null });
    } catch (error) {
      res.json({ success: false, error });
    }
  },

}
