import Joi from 'joi';
import { FilemakerDataAPIOptions } from '../src';

const schema = Joi.object<FilemakerDataAPIOptions>({
  host: Joi.string().required(),
  database: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  layout: Joi.string().required(),
});

export function getConfig() {
  const { value } = schema.validate({
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    layout: process.env.LAYOUT,
  });

  if (!value) {
    throw new Error('Unable to load env');
  }

  return value;
}
