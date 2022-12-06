import express from "express";
import path from "path";
import { ROLES_LIST } from "../../config/roles_list";
import { verifyJWT } from "../../middleware/verifyJWT";
import { verifyRoles } from "../../middleware/verifyRoles";
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controller/employeesController";
import info from "../data/employee.json";

const router = express.Router();
const app = express();
export type TEP = {
  [key: string]: number | string;
  id: number;
  firstname: string;
  lastname: string;
};

export interface TData {
  employees?: TEP[];
  setEmployees?(data: TEP): void | TEP | any;
}
const data: TData = {};

data.employees = info;

router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
  .put((req, res) => {
    (data.employees as TEP[]).forEach((employee) => {
      if (employee.id === req.body.id) {
        employee.firstname = req.body.firstname;
        employee.lastname = req.body.lastname;
        return;
      } else {
        return;
      }
    });
    res.json({
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      updated: true,
      message: "Employee updated",
    });
  })
  .delete(verifyRoles(ROLES_LIST.Admin), (req, res) => {
    res.json({
      id: req.body.id,
      message: "Employee deleted",
      updated: true,
    });
    res.cookie("", {});
  });

router.route("/:id").get((req, res) => {
  res.json({
    id: req.params.id,
    updated: true,
    message: "Employee updated",
  });
});

export { router };
