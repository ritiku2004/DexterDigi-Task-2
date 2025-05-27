import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EmployeeRoles() {
    const [roleName, setRoleName] = useState('');
    const [menus, setMenus] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchMenus();
        fetchPermissions();
        fetchRoles();
    }, []);

    const fetchMenus = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/sidebarmenus');
            setMenus(data);
        } catch (err) {
            toast.error('Failed to fetch sidebar menus');
        }
    };

    const fetchPermissions = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/permissions');
            const grouped = data.reduce((acc, perm) => {
                acc[perm.module_name] = acc[perm.module_name] || [];
                acc[perm.module_name].push(perm);
                return acc;
            }, {});
            setPermissions(grouped);
        } catch (err) {
            toast.error('Failed to fetch permissions');
        }
    };

    const fetchRoles = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/roles');
            setRoles(data);
        } catch (err) {
            toast.error('Failed to fetch roles');
        }
    };

    const handleSubmit = async () => {
        if (!roleName) return toast.error('Role name is required');
        if (!selectedMenus.length || !Object.values(selectedPermissions).flat().length) {
            return toast.error('Select at least one menu and one permission');
        }

        const finalPermissions = Object.values(selectedPermissions).flat();

        try {
            await axios.post('http://localhost:5000/api/roles', {
                name: roleName,
                sidebarMenus: selectedMenus,
                permissions: finalPermissions,
            });
            toast.success('Role created successfully!');
            setRoleName('');
            setSelectedMenus([]);
            setSelectedPermissions({});
            fetchRoles();
        } catch (err) {
            toast.error('Failed to create role');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto text-gray-900">
            <h1 className="text-4xl font-extrabold mb-12">Manage Employee Roles</h1>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
                <div className="mb-8">
                    <label className="block text-lg font-medium mb-2">Role Name</label>
                    <input
                        type="text"
                        placeholder="Enter role name"
                        value={roleName}
                        onChange={e => setRoleName(e.target.value)}
                        className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none text-lg py-2 transition-colors duration-300"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sidebar Menus */}
                    <details className="group" open>
                        <summary className="flex justify-between items-center cursor-pointer text-xl font-semibold mb-4 list-none">
                            <span>Sidebar Menus</span>
                            <svg
                                className="w-6 h-6 transform transition-transform duration-300 group-open:rotate-90"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </summary>
                        <div className="space-y-4 pl-2">
                            {menus.map(menu => (
                                <label key={menu._id} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={selectedMenus.includes(menu._id)}
                                        onChange={e => {
                                            const updated = e.target.checked
                                                ? [...selectedMenus, menu._id]
                                                : selectedMenus.filter(id => id !== menu._id);
                                            setSelectedMenus(updated);
                                        }}
                                    />
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg border-2 transition-all duration-200
                    ${selectedMenus.includes(menu._id)
                                            ? 'bg-indigo-500 border-indigo-500'
                                            : 'border-gray-400 group-hover:border-indigo-300'}`}>
                                        {selectedMenus.includes(menu._id) && (
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </span>
                                    <span className="text-base">{menu.title}</span>
                                </label>
                            ))}
                        </div>
                    </details>

                    {/* Permissions */}
                    <details className="group" open>
                        <summary className="flex justify-between items-center cursor-pointer text-xl font-semibold mb-4 list-none">
                            <span>Permissions</span>
                            <svg
                                className="w-6 h-6 transform transition-transform duration-300 group-open:rotate-90"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </summary>
                        <div className="space-y-6 pl-2">
                            {Object.entries(permissions).map(([module, perms]) => (
                                <div key={module}>
                                    <div className="text-lg font-medium mb-2">{module}</div>
                                    <div className="space-y-3 pl-4">
                                        {perms.map(perm => (
                                            <label key={perm._id} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={selectedPermissions[module]?.includes(perm._id) || false}
                                                    onChange={e => {
                                                        const current = selectedPermissions[module] || [];
                                                        const updated = e.target.checked
                                                            ? [...current, perm._id]
                                                            : current.filter(id => id !== perm._id);
                                                        setSelectedPermissions({
                                                            ...selectedPermissions,
                                                            [module]: updated,
                                                        });
                                                    }}
                                                />
                                                <span className={`w-6 h-6 flex items-center justify-center rounded-lg border-2 transition-all duration-200
                          ${selectedPermissions[module]?.includes(perm._id)
                                                        ? 'bg-indigo-500 border-indigo-500'
                                                        : 'border-gray-400 group-hover:border-indigo-300'}`}>
                                                    {selectedPermissions[module]?.includes(perm._id) && (
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span className="text-base">{perm.permission_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>

                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Roles List Section */}
            <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Existing Roles</h2>
                <div className="flex flex-col space-y-6">
                    {roles.map((role) => (
                        <button
                            key={role._id}
                            className="w-full text-left p-6 bg-gradient-to-br from-white to-indigo-50 
                   hover:from-indigo-100 hover:to-purple-100 rounded-2xl shadow-md 
                   hover:shadow-xl transition-transform duration-300 transform 
                   hover:-translate-y-1 focus:outline-none"
                            onClick={() => {/* handle click if needed */ }}
                        >
                            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                                {role.name}
                            </h3>
                            <div className="mb-3">
                                <div className="text-sm font-medium text-gray-600 mb-1">Menus</div>
                                <div className="flex flex-wrap">
                                    {role.sidebarMenus.length > 0
                                        ? role.sidebarMenus.map((m) => (
                                            <span
                                                key={m._id}
                                                className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                                            >
                                                {m.title}
                                            </span>
                                        ))
                                        : (
                                            <span className="text-xs text-gray-400 italic">None</span>
                                        )}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-600 mb-1">Permissions</div>
                                <div className="flex flex-wrap">
                                    {role.permissions.length > 0
                                        ? role.permissions.map((p) => (
                                            <span
                                                key={p._id}
                                                className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                                            >
                                                {p.permission_name}
                                            </span>
                                        ))
                                        : (
                                            <span className="text-xs text-gray-400 italic">None</span>
                                        )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>


        </div>
    );
}
