db.createUser(
  {
    user: "todos",
    pwd: "todos",
    roles: [
      {
        role: "readWrite",
        db: "todos"
      }
    ]
  }
)