import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { organizationApi } from "../services/api";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

interface Organization {
  id: number;
  name: string;
  parentId?: number | null;
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationApi.getAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError("Failed to fetch organizations: " + ((err as Error).message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await organizationApi.createOrganization({
        name: newOrgName,
        parentId: parentId || undefined
      });
      setNewOrgName("");
      setParentId(null);
      setIsAdding(false);
      fetchOrganizations(); // Refresh the list
    } catch (err) {
      setError("Failed to create organization: " + ((err as Error).message || String(err)));
    }
  };

  const handleDeleteOrganization = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await organizationApi.deleteOrganization(id.toString());
        fetchOrganizations(); // Refresh the list
      } catch (err) {
        setError("Failed to delete organization: " + ((err as Error).message || String(err)));
      }
    }
  };

  return (
    <div>
      <PageMeta 
        title="Organizations - Admin Dashboard" 
        description="Manage organizations in the system" 
      />
      <PageBreadcrumb pageTitle="Organizations" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] xl:p-6">
        <div className="mb-6 flex flex-row justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Organizations Management</h3>
          {isSuperAdmin && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isAdding ? "Cancel" : "Add Organization"}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-800 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {isSuperAdmin && isAdding && (
          <form onSubmit={handleAddOrganization} className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="orgName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="orgName"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label htmlFor="parentOrg" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Parent Organization (Optional)
                </label>
                <select
                  id="parentOrg"
                  value={parentId || ""}
                  onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select parent organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Create Organization
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Parent ID</th>
                  {isSuperAdmin && (
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{org.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{org.name}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {org.parentId ? org.parentId : "-"}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteOrganization(org.id)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}