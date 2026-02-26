import Footer from "../models/Footer.js";

/* GET */
export const getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* POST/PUT */
export const saveFooter = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.resume = req.file.filename;
    }

    let footer = await Footer.findOne();

    if (!footer) {
      footer = new Footer(data);
    } else {
      Object.assign(footer, data);
    }

    await footer.save();

    res.json({ message: "Footer updated", footer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
