module.exports = (app, handlers) => {
  app.get("/api/leads", handlers.leads);
};
