import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Users,
  FileText,
  UserCircle2,
  Trash2,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Department = {
  id: string;
  name: string;
  description: string;
  head: string;
  employeeCount: number;
  createdAt: string;
};

const DEPARTMENT_STORAGE_KEY = 'department_manager_departments';

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return String(Date.now());
}

export function Dashboard() {
  const { user, signOut } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [head, setHead] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEPARTMENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Department[];
        setDepartments(parsed);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      localStorage.removeItem(DEPARTMENT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DEPARTMENT_STORAGE_KEY, JSON.stringify(departments));
  }, [departments]);

  const totalEmployees = useMemo(() => {
    return departments.reduce((sum, item) => sum + item.employeeCount, 0);
  }, [departments]);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Department name is required.');
      return;
    }

    if (!head.trim()) {
      setError('Department head is required.');
      return;
    }

    const parsedEmployeeCount = Number(employeeCount);

    if (Number.isNaN(parsedEmployeeCount) || parsedEmployeeCount < 0) {
      setError('Employee count must be a valid number.');
      return;
    }

    const newDepartment: Department = {
      id: createId(),
      name: name.trim(),
      description: description.trim(),
      head: head.trim(),
      employeeCount: parsedEmployeeCount,
      createdAt: new Date().toLocaleString(),
    };

    setDepartments((prev) => [newDepartment, ...prev]);
    setName('');
    setDescription('');
    setHead('');
    setEmployeeCount('');
    setSuccess('Department created successfully.');
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Department Dashboard
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Logged in as <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Departments</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {departments.length}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Employees</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {totalEmployees}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Admin User</p>
                <h2 className="text-lg font-bold text-slate-900 mt-2 break-all">
                  {user?.email}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Create Department
              </h2>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter department name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department Head
                </label>
                <input
                  type="text"
                  value={head}
                  onChange={(e) => setHead(e.target.value)}
                  placeholder="Enter department head"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Employee Count
                </label>
                <input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="Enter employee count"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter department description"
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Create Department
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">
                Department List
              </h2>
            </div>

            {departments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No departments created yet.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {departments.map((department) => (
                  <div
                    key={department.id}
                    className="rounded-xl border border-slate-200 p-4 bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {department.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="font-medium">Head:</span> {department.head}
                        </p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Employees:</span>{' '}
                          {department.employeeCount}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          {department.description || 'No description added.'}
                        </p>
                        <p className="text-xs text-slate-400 mt-3">
                          Created: {department.createdAt}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="inline-flex items-center justify-center rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                        title="Delete department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}