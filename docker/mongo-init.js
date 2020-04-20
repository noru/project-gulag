db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'dbOwner',
      db: 'gulag',
    },
  ],
})
