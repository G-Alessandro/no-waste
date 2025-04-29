const services = [
  {
    route: "/authentication",
    target: process.env.AUTHENTICATION_SERVICES,
    requiresAuthentication: false,
  },
  {
    route: "/users",
    target: process.env.USERS_SERVICES,
    requiresAuthentication: true,
  },
  {
    route: "/stores",
    target: process.env.USERS_SERVICES,
    requiresAuthentication: false,
  },
];

module.exports = { services };
