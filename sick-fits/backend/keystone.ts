import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { GraphQLConfig } from '@keystone-next/types';
import { User } from './schemas/User';
import 'dotenv/config';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { sendPasswordResetEmail } from './lib/mail';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { extendGraphqlSchema } from './mutations';
// import { sendPasswordResetEmail } from './lib/mail';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long should they stay signed in
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in inital roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    lists: createSchema({
      // TODO: schema items go here
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
    }),
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO: add data seeding  here
    },
    extendGraphqlSchema,
    ui: {
      // TODO: change this for roles
      // show the ui for anyone who passes this test
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
    graphql: {
      debug: true,
    } as GraphQLConfig,
  })
);
