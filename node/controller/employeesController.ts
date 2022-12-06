import model from "../data/employee.json";
import { TData, TEP } from "../api/employees";
const data: TData = {};
data.employees = model;

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  (data.employees as TEP[]).push(req.body);
  res.json({
    id: (data.employees as TEP[]).length - 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const updateEmployee = (req, res) => {
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
};

const deleteEmployee = (req, res) => {
  res.json({
    id: req.body.id,
    message: "Employee deleted",
    updated: true,
  });
};

const getEmployeeById = (req, res) => {
  res.json({
    id: req.params.id,
    updated: true,
    message: "Employee updated",
  });
};

export {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};
