export interface ReqOptions {
  roles?: { role?: any }[];
}

const verifyRoles = (...allowedRoles) => {
  return (
    req?: ReqOptions,
    res?: { sendStatus(status: number): void },
    next?: any
  ) => {
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req?.roles);
    const result = req?.roles
      ?.map((role) => rolesArray?.includes(role))
      .find((val) => val === true);
    if (!result) return res?.sendStatus(401);
    next();
  };
};

export { verifyRoles };
