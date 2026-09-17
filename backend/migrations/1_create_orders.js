exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    phone: { type: 'varchar(50)', notNull: true },
    email: { type: 'varchar(255)' },
    product: { type: 'varchar(255)', notNull: true },
    quantity: { type: 'int', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    notes: { type: 'text' },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'Pending',
      check: "status IN ('Pending','Confirmed','Delivered')"
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('orders')
}
