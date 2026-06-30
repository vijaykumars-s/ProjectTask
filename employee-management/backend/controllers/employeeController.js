import Employee from '../models/Employee.js';

// @desc    Get all employees with pagination, search, filter
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const department = req.query.department || '';
    const status = req.query.status || '';

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }

    const totalCount = await Employee.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const employees = await Employee.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      employees,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private
export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(400);
      throw new Error('Employee with this email already exists');
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      designation,
      status,
      joiningDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private
export const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.department = department || employee.department;
      employee.designation = designation || employee.designation;
      employee.status = status || employee.status;
      employee.joiningDate = joiningDate || employee.joiningDate;

      const updatedEmployee = await employee.save();
      res.json({
        success: true,
        employee: updatedEmployee,
      });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await Employee.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Employee removed' });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/employees/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    
    const departmentWise = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    
    const monthlyJoined = await Employee.aggregate([
      { 
        $group: { 
          _id: { month: { $month: '$joiningDate' }, year: { $year: '$joiningDate' } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const statusDistribution = await Employee.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees: totalEmployees - activeEmployees,
        departmentWise,
        monthlyJoined,
        statusDistribution,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct departments
// @route   GET /api/employees/departments
// @access  Private
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Employee.distinct('department');
    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    next(error);
  }
};
