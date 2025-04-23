import moment from "moment";

export const loggerMiddleware = (req, res, next) => {
  console.log(
    `${moment().format("DD.MM.yyyy hh:mm:ss")} [${req.ip}] [${req.path}]`,
  );
  next();
};
