import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const AccountPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="mt-1 text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
