const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/admin/employees
const getAllEmployees = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/admin/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee role or details
// @route   PUT /api/admin/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { name, department, role } = req.body;

    if (name) user.name = name;
    if (department) user.department = department;
    if (role) user.role = role;

    await user.save();
    res.status(200).json({ message: 'Employee updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEmployees, deleteEmployee, updateEmployee };