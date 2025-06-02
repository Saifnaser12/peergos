import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useUserRole } from '../context/UserRoleContext';
import PermissionDenied from './PermissionDenied';
const ProtectedRoute = ({ children, path, requiredPermission = 'view', resource }) => {
    const { canAccess, hasPermission } = useUserRole();
    // First check if user can access the route
    if (!canAccess(path)) {
        return _jsx(PermissionDenied, {});
    }
    // If specific resource and permission are required, check those too
    if (resource && !hasPermission(resource, requiredPermission)) {
        return _jsx(PermissionDenied, {});
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
