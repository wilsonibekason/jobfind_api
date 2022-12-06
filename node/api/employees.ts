import express from "express";
import path from "path";
import info from "../data/employee.json";

const router = express.Router();
const app = express();
type TEP = {
  [key: string]: number | string;
  id: number;
  firstname: string;
  lastname: string;
};
const data: {
  employees?: TEP[];
} = {};

data.employees = info;

router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    (data.employees as TEP[]).push(req.body);
    res.json({
      id: (data.employees as TEP[]).length - 1,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  });

export { router };
