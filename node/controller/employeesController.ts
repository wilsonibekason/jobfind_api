import model from "../data/employee.json";
import { TData, TEP } from "../api/employees";
import { Employee } from "../model/Employee";
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
const createEmployee = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname)
    return res
      .status(400)
      .json({ message: "First and Last names are required " });

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  } catch (error) {
    error instanceof Error && error.message;
  }
  // const newEmployee: TEP = {
  //   id:
  //     (data.employees as TEP[])[(data.employees as TEP[]).length - 1].id + 1 ||
  //     1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  // };
  // !newEmployee.firstname ||
  //   (!newEmployee.lastname &&
  //     res
  //       .status(400)
  //       .json({ message: "first name and last name is required" }));
  // //@ts-ignore
  // data.setEmployees([...data.employees, newEmployee]);

  res.status(201).json(data.employees);
};

const updateEmployees = async (req, res) => {
  // const employee = (data.employees as TEP[]).find(
  //   (e) => e.id === parseInt(req.body.id)
  // );

  if (!req.body.id)
    return res.status(400).json({ message: "No employee id found" });

  const employee = Employee.findOne({ _id: req.body.id });
  if (!employee) {
    return res.status(204).json({ message: "Employee not found" });
  }
  if (req.body.firstname !== employee.firstname) {
    employee.firstname = req.body.firstname;
  }
  if (req.boxy.firstname) employee.lastname = req.boxy.firstname;
  if (req.boxy.lastname) employee.lastname = req.boxy.lastname;
  const filteredArray = (data.employees as TEP[]).filter(
    (e) => e.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, employee];
  //   @ts-ignore
  data.setEmployees(
    // @ts-ignore
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  const result = await  employee.save()
  res.status(201).json(data.employees);
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

const removeEmloyee = (req, res) => {
  const employee = (data.employees as TEP[]).find((e) => e.id === req.body.id);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  const filteredArray = (data.employees as TEP[]).filter(
    (e) => e.id !== req.body.id
  );
  const unsortedArray = [...filteredArray, employee];
  //   @ts-ignore
  data.setEmployees([...filteredArray]);
  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  res.json({
    id: req.body.id,
    message: "Employee deleted",
    updated: true,
  });
};

const getEmployee = (req, res) => {
  const employee = (data.employees as TEP[]).find(
    (e) => e.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(404)
      .json({ message: `Employee ${req.params.id} not found` });
  }
  res.json(employee);
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
