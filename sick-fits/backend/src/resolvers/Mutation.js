const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO Check if they are logged in
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
      },
    }, info);
    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id, title }`);
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
