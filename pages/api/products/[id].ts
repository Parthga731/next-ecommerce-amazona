import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const singleProduct = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(singleProduct);
};

export default handler;
