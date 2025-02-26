const services = [
  {
    route: "/authentication",
    target: process.env.AUTHENTICATION_SERVICES,
  },
  {
    route: "/users",
    target: process.env.USERS_SERVICES,
  },
];

module.exports = { services };
