🔐 Auth Routes
Method	Endpoint	Description

- POST	/api/v1/auth/register	Register employee/admin
- POST	/api/v1/auth/login	Login and return JWT
- GET	/api/v1/auth/profile	Get logged-in user's info
- POST	/api/v1/auth/logout	Logout current user
- POST	/api/v1/auth/request-reset	Send reset email
- GET	/api/v1/auth/verify-reset/:token	Validate reset token
- POST	/api/v1/auth/reset-password	Set new password

👤 Employee Routes
Method	Endpoint	Description


- GET	/api/v1/employees	Admin: Get all employees
- GET	/api/v1/employees/:id	Get employee by ID
- POST	/api/v1/employees	Create a new employee
- PATCH	/api/v1/employees/:id	Update employee (e.g. role)
- DELETE	/api/v1/employees/:id	Delete employee

📅 Attendance Routes
Method	Endpoint	Description


- POST	/api/v1/attendance/clock-in	Mark clock-in
- POST	/api/v1/attendance/clock-out	Mark clock-out
- GET	/api/v1/attendance/:id	Get all attendance for employee
- GET	/api/v1/attendance/:id/calendar	Full calendar view
- GET	/api/v1/attendance/filter	Admin: Filter by date, role, WFH type

⚙️ Admin Routes
Method	Endpoint	Description


- PATCH	/api/v1/admin/set-role	🔁 Promote/demote employee (set role)
- GET	/api/v1/admin/dashboard	📊 Admin dashboard stats

📤 Export / Report Routes
Method	Endpoint	Description


- GET	/api/v1/report/attendance	Get attendance report
- GET	/api/v1/report/leaves	Get leave statistics
- GET	/api/v1/report/payroll	Get payroll summary
- GET	/api/v1/report/tasks	Get task performance report

🏖️ Leave Routes
Method	Endpoint	Description


- POST	/api/v1/leaves	Apply for leave
- GET	/api/v1/leaves/:id	Get leaves for an employee
- PATCH	/api/v1/leaves/:id/approve	Approve leave
- PATCH	/api/v1/leaves/:id/reject	Reject leave

💰 Payroll Routes
Method	Endpoint	Description


- POST	/api/v1/payroll	Generate payroll
- GET	/api/v1/payroll	Get all payrolls
- GET	/api/v1/payroll/:id	Get payrolls for an employee

🏢 Department Routes
Method	Endpoint	Description


- POST	/api/v1/departments	Create department
- GET	/api/v1/departments	Get all departments
- PATCH	/api/v1/departments/:id	Update department
- DELETE	/api/v1/departments/:id	Delete department

📌 Task Routes
Method	Endpoint	Description


- POST	/api/v1/tasks	Assign task
- GET	/api/v1/tasks/:id	Get tasks for employee
- PATCH	/api/v1/tasks/:id/status	Update task status
- POST	/api/v1/tasks/:id/comment	Add task comment

🔁 Work Type Route
Method	Endpoint	Description


- GET	/api/v1/work-type/list	List work from home types