import {
  integer,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({
      ref: 'OrderItem.order',
      many: true,
    }),
    user: relationship({
      ref: 'User.orders',
    }),
    charge: text(),
  },
});
