import Footer from "../models/Footer.js";

export const getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveFooter = async (req, res) => {
  try {
    const body = req.body;

    if (req.file) body.resume = req.file.filename;

    let footer = await Footer.findOne();
    if (!footer) footer = new Footer(body);
    else Object.assign(footer, body);

    await footer.save();

    res.json({ message: "Footer updated", footer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
