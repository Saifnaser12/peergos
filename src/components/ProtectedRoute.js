import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
const ProtectedRoute = ({ rolesAllowed, children, redirectTo = '/unauthorized' }) => {
    const { role } = useUserRole();
    // Check if user's current role is in the allowed roles
    if (!rolesAllowed.includes(role)) {
        return _jsx(Navigate, { to: redirectTo, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
